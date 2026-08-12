import type { Side, Position } from '@/types/piece'
import type { Move, Rights, PromotionSlot } from '@/types/move'
import { CENTRE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, LEGIONARY, CASTLING } from '@/constants/piece'
import { fromSquare, toSquare } from '../lib/coordinate'

const board = (position: Position, move: Move): Position => {
  const next = { ...position }
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
const castling = (position: Position, move: Move, held: Rights['castling']): Rights['castling'] => {
  const mover = position[move.from]
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
const enPassant = (position: Position, move: Move): Rights['enPassant'] => {
  const mover = position[move.from]
  const step = mover?.side === WHITE ? 1 : -1
  const origin = fromSquare(move.from)
  const target = fromSquare(move.to)
  if (
    mover?.piece !== LEGIONARY ||
    target.rank !== CENTRE ||
    origin.rank !== CENTRE - step * (CENTRE - 3)
  )
    return null
  return { behind: toSquare(target.file, CENTRE - step), enemy: move.to }
}
const promotion = (
  position: Position,
  move: Move,
  open: Record<Side, PromotionSlot[]>
): Record<Side, PromotionSlot[]> => {
  const mover = position[move.from]
  const next = { [WHITE]: [...open[WHITE]], [BLACK]: [...open[BLACK]] }
  if (mover && move.promotesTo) {
    const arrived = fromSquare(move.to).file
    const taken = next[mover.side].findIndex(
      slot => slot.piece === move.promotesTo && Math.abs(slot.file - arrived) <= 1
    )
    if (taken !== -1) next[mover.side].splice(taken, 1)
  }
  move.captures?.forEach(square => {
    const dead = position[square]
    if (!dead || dead.piece === POPE) return
    next[dead.side].push({ piece: dead.piece, file: fromSquare(square).file })
  })
  return next
}
const progress = (position: Position, move: Move, idle: number): number => {
  const made =
    (move.captures?.length ?? 0) > 0 ||
    position[move.from]?.piece === LEGIONARY ||
    move.promotesTo !== undefined
  return made ? 0 : idle + 1
}
export const apply = (
  position: Position,
  move: Move,
  rights: Rights,
  slots: Record<Side, PromotionSlot[]>,
  idle = 0
): {
  position: Position
  rights: Rights
  slots: Record<Side, PromotionSlot[]>
  idle: number
} => ({
  position: board(position, move),
  rights: {
    castling: castling(position, move, rights.castling),
    enPassant: enPassant(position, move)
  },
  slots: promotion(position, move, slots),
  idle: progress(position, move, idle)
})