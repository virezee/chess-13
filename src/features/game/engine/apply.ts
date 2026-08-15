import type { SquareOccupant } from '@/types/material'
import type { EnPassant, Move, State } from '@/types/game'
import { CENTRE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, LEGIONARY, CASTLING } from '@/constants/piece'
import { fromSquare, toSquare } from '../lib/coordinate'

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
    const arrived = fromSquare(move.to).file
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
    const file = fromSquare(square).file
    const slot = next[dead.side].find(held => held.file === file)
    if (slot) slot.piece.push(dead.piece)
    else next[dead.side].push({ file, piece: [dead.piece] })
  })
  return next
}
const enPassant = (occupancy: SquareOccupant, move: Move): EnPassant | null => {
  const mover = occupancy[move.from]
  const step = mover?.side === WHITE ? 1 : -1
  const origin = fromSquare(move.from)
  const target = fromSquare(move.to)
  if (
    mover?.piece !== LEGIONARY ||
    target.rank !== CENTRE ||
    origin.rank !== CENTRE - step * (CENTRE - 3)
  )
    return null
  return { target: toSquare(target.file, CENTRE - step), captured: move.to }
}
const progress = (occupancy: SquareOccupant, move: Move, noProgress: number): number => {
  const made =
    (move.captures?.length ?? 0) > 0 ||
    occupancy[move.from]?.piece === LEGIONARY ||
    move.promotesTo !== undefined
  return made ? 0 : noProgress + 1
}
export const apply = (
  occupancy: SquareOccupant,
  move: Move,
  state: State
): { occupancy: SquareOccupant; state: State } => ({
  occupancy: board(occupancy, move),
  state: {
    castlingSide: castling(occupancy, move, state.castlingSide),
    promotions: promotion(occupancy, move, state.promotions),
    enPassant: enPassant(occupancy, move),
    riposte: state.riposte,
    noProgress: progress(occupancy, move, state.noProgress),
    noProgressLimit: state.noProgressLimit
  }
})