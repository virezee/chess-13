import type { Side, SquareOccupant } from '@/types/material'
import type { Step, Move, EnPassant, Counter, State, Position, Match, Save } from '@/types/game'
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
const isLineClear = (occupancy: SquareOccupant, { from, to }: Step): boolean => {
  if (from === to) return false
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const fileDelta = target.file - origin.file
  const rankDelta = target.rank - origin.rank
  if (fileDelta !== 0 && rankDelta !== 0 && Math.abs(fileDelta) !== Math.abs(rankDelta))
    return false
  const fileStep = Math.sign(fileDelta)
  const rankStep = Math.sign(rankDelta)
  const fromOrigin = Math.max(Math.abs(fileDelta), Math.abs(rankDelta))
  for (let distance = 1; distance < fromOrigin; distance += 1) {
    if (
      occupancy[
        makeSquare({
          file: origin.file + fileStep * distance,
          rank: origin.rank + rankStep * distance
        })
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
  const enemy = mover.side === WHITE ? BLACK : WHITE
  const marshalSq = pieces[enemy][MARSHAL][0] ?? null
  if (marshalSq === null || move.captures?.includes(marshalSq)) return false
  return riposteSquares(mover.side, occupancy, move).some(square =>
    isLineClear(next, { from: marshalSq, to: square })
  )
}
const castling = (
  occupancy: SquareOccupant,
  castlingSide: State['castlingSide'],
  move: Move
): State['castlingSide'] => {
  const mover = occupancy[move.from]
  const next = { [WHITE]: castlingSide[WHITE], [BLACK]: castlingSide[BLACK] }
  for (const side of [WHITE, BLACK] as const) {
    const wings = CASTLING[side]
    const isMoving = mover?.side === side
    if (isMoving && mover.piece === POPE) {
      next[side] = { left: false, right: false }
      continue
    }
    next[side] = {
      left:
        next[side].left &&
        !(isMoving && move.from === wings.left.sentinel) &&
        !move.captures?.includes(wings.left.sentinel),
      right:
        next[side].right &&
        !(isMoving && move.from === wings.right.sentinel) &&
        !move.captures?.includes(wings.right.sentinel)
    }
  }
  return next
}
const promotion = (
  occupancy: SquareOccupant,
  promotions: State['promotions'],
  move: Move
): State['promotions'] => {
  const mover = occupancy[move.from]
  const next = {
    [WHITE]: promotions[WHITE].map(slot => ({ ...slot, piece: [...slot.piece] })),
    [BLACK]: promotions[BLACK].map(slot => ({ ...slot, piece: [...slot.piece] }))
  }
  const promotesTo = move.promotesTo
  if (mover && promotesTo !== undefined) {
    const file = parseSquare(move.to).file
    const index = next[mover.side].findIndex(
      slot => slot.piece.includes(promotesTo) && Math.abs(slot.file - file) <= 1
    )
    const slot = next[mover.side][index]
    if (slot) {
      slot.piece.splice(slot.piece.indexOf(promotesTo), 1)
      if (slot.piece.length === 0) next[mover.side].splice(index, 1)
    }
  }
  move.captures?.forEach(square => {
    const captured = occupancy[square]
    if (!captured || captured.piece === POPE) return
    const captfile = parseSquare(square).file
    const slot = next[captured.side].find(({ file }) => file === captfile)
    if (slot) slot.piece.push(captured.piece)
    else next[captured.side].push({ file: captfile, piece: [captured.piece] })
  })
  return next
}
const enPassant = (occupancy: SquareOccupant, move: Move): EnPassant | null => {
  const mover = occupancy[move.from]
  const push = mover?.side === WHITE ? 1 : -1
  const origin = parseSquare(move.from)
  const target = parseSquare(move.to)
  if (
    mover?.piece !== LEGIONARY ||
    target.rank !== CENTRE ||
    origin.rank !== CENTRE - push * (CENTRE - 3)
  )
    return null
  return { target: makeSquare({ file: target.file, rank: CENTRE - push }), captured: move.to }
}
const progress = (
  occupancy: SquareOccupant,
  next: SquareOccupant,
  move: Move,
  noProgress: Counter
): Counter => {
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
// Black loses the swap right the moment its first turn is over, whether it took the swap or replied
// with a move. Nothing behind the last reset of the no-progress count is ever read again, so the
// history is cut back to the key the resetting move itself leaves.
const record = (side: Side, match: Match, key: string, noProgress: Counter): Match => ({
  ...match,
  swap: match.swap && side !== BLACK,
  history: noProgress.count === 0 ? [key] : [...match.history, key]
})
export const apply = (
  position: Position,
  move: Move,
  match: Match,
  key: string
): Pick<Save, 'occupancy' | 'state' | 'match'> => {
  const { occupancy, state } = position
  const next = board(occupancy, move)
  const noProgress = progress(occupancy, next, move, state.noProgress)
  return {
    occupancy: next,
    state: {
      awake: state.awake,
      riposte: riposte(position, move, next),
      castlingSide: castling(occupancy, state.castlingSide, move),
      promotions: promotion(occupancy, state.promotions, move),
      enPassant: enPassant(occupancy, move),
      noProgress
    },
    match: record(position.side, match, key, noProgress)
  }
}
// There is no move to apply, so nothing is written again except the swap right and the player who
// owns White from here on, and no key is pushed: the board and the side to move are the ones the
// last key already holds.
export const takeSwap = (match: Match, owner: string): Match => ({
  ...match,
  swap: false,
  whitePlayer: owner
})