import type { SquareOccupant } from '@/types/material'
import type { EnPassant, Move, State, Step, Position, NoProgress } from '@/types/game'
import { CENTRE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, MARSHAL, LEGIONARY, CASTLING } from '@/constants/piece'
import {
  PLIES_PER_MOVE,
  NO_PROGRESS_BASE,
  NO_PROGRESS_PER_PIECE,
  STARTING_PIECES
} from '@/constants/outcome'
import { parseSquare, makeSquare } from '../lib/coordinate'
import { riposteSquares } from './moves'

const board = (occupancy: SquareOccupant, move: Move): SquareOccupant => {
  const next = { ...occupancy }
  const mover = next[move.from]
  delete next[move.from]
  move.captures?.forEach(square => delete next[square])
  if (move.sentinel) {
    const sentinel = next[move.sentinel.from]
    delete next[move.sentinel.from]
    if (sentinel) next[move.sentinel.to] = sentinel
  }
  if (mover && !move.captures?.includes(move.from))
    next[move.to] = move.promotesTo ? { side: mover.side, piece: move.promotesTo } : mover
  return next
}
const castling = (
  occupancy: SquareOccupant,
  move: Move,
  held: State['castlingSide']
): State['castlingSide'] => {
  const mover = occupancy[move.from]
  const kept = { [WHITE]: held[WHITE], [BLACK]: held[BLACK] }
  for (const side of [WHITE, BLACK] as const) {
    const wings = CASTLING[side]
    const stepped = mover?.side === side
    if (stepped && mover.piece === POPE) {
      kept[side] = { left: false, right: false }
      continue
    }
    kept[side] = {
      left:
        kept[side].left &&
        !(stepped && move.from === wings.left.sentinel) &&
        !move.captures?.includes(wings.left.sentinel),
      right:
        kept[side].right &&
        !(stepped && move.from === wings.right.sentinel) &&
        !move.captures?.includes(wings.right.sentinel)
    }
  }
  return kept
}
const promotion = (
  occupancy: SquareOccupant,
  move: Move,
  open: State['promotions']
): State['promotions'] => {
  const mover = occupancy[move.from]
  const next = {
    [WHITE]: open[WHITE].map(slot => ({ ...slot, piece: [...slot.piece] })),
    [BLACK]: open[BLACK].map(slot => ({ ...slot, piece: [...slot.piece] }))
  }
  const promotesTo = move.promotesTo
  if (mover && promotesTo !== undefined) {
    const arrived = parseSquare(move.to).file
    const taken = next[mover.side].findIndex(
      slot => slot.piece.includes(promotesTo) && Math.abs(slot.file - arrived) <= 1
    )
    const slot = next[mover.side][taken]
    if (slot) {
      slot.piece.splice(slot.piece.indexOf(promotesTo), 1)
      if (slot.piece.length === 0) next[mover.side].splice(taken, 1)
    }
  }
  move.captures?.forEach(square => {
    const dead = occupancy[square]
    if (!dead || dead.piece === POPE) return
    const file = parseSquare(square).file
    const slot = next[dead.side].find(held => held.file === file)
    if (slot) slot.piece.push(dead.piece)
    else next[dead.side].push({ file, piece: [dead.piece] })
  })
  return next
}
const enPassant = (occupancy: SquareOccupant, move: Move): EnPassant | null => {
  const mover = occupancy[move.from]
  const step = mover?.side === WHITE ? 1 : -1
  const origin = parseSquare(move.from)
  const target = parseSquare(move.to)
  if (
    mover?.piece !== LEGIONARY ||
    target.rank !== CENTRE ||
    origin.rank !== CENTRE - step * (CENTRE - 3)
  )
    return null
  return { target: makeSquare({ file: target.file, rank: CENTRE - step }), captured: move.to }
}
const clearLine = (occupancy: SquareOccupant, { from, to }: Step): boolean => {
  if (from === to) return false
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  for (let step = 1; step < distance; step += 1) {
    if (
      occupancy[
        makeSquare({ file: origin.file + fileStep * step, rank: origin.rank + rankStep * step })
      ]
    )
      return false
  }
  return true
}
const riposte = (position: Position, move: Move, next: SquareOccupant): boolean => {
  const { pieces, occupancy } = position
  const mover = occupancy[move.from]
  if (!mover) return false
  const side = mover.side === WHITE ? BLACK : WHITE
  const marshalSquare = pieces[side][MARSHAL][0]
  if (marshalSquare === undefined || move.captures?.includes(marshalSquare)) return false
  return riposteSquares(mover.side, occupancy, move).some(square =>
    clearLine(next, { from: marshalSquare, to: square })
  )
}
const progress = (
  occupancy: SquareOccupant,
  next: SquareOccupant,
  move: Move,
  noProgress: NoProgress
): NoProgress => {
  const made =
    (move.captures?.length ?? 0) > 0 ||
    occupancy[move.from]?.piece === LEGIONARY ||
    move.promotesTo !== undefined
  if (!made) return { count: noProgress.count + 1, limit: noProgress.limit }
  const pieces = Object.keys(next).length
  return {
    count: 0,
    limit: (NO_PROGRESS_BASE + NO_PROGRESS_PER_PIECE * (STARTING_PIECES - pieces)) * PLIES_PER_MOVE
  }
}
export const apply = (
  position: Position,
  move: Move
): { occupancy: SquareOccupant; state: State } => {
  const { occupancy, state } = position
  const next = board(occupancy, move)
  return {
    occupancy: next,
    state: {
      castlingSide: castling(occupancy, move, state.castlingSide),
      promotions: promotion(occupancy, move, state.promotions),
      enPassant: enPassant(occupancy, move),
      awake: state.awake,
      riposte: riposte(position, move, next),
      noProgress: progress(occupancy, next, move, state.noProgress)
    }
  }
}