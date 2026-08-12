import type { Position } from '@/types/piece'
import type { Move, Rights } from '@/types/move'
import { CENTRE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, LEGIONARY, CASTLING } from '@/constants/piece'
import { fromSquare, toSquare } from '../lib/coordinate'

export const apply = (
  position: Position,
  move: Move,
  rights: Rights
): { position: Position; rights: Rights } => {
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
  const kept = { [WHITE]: rights.castling[WHITE], [BLACK]: rights.castling[BLACK] }
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
  const step = mover?.side === WHITE ? 1 : -1
  const origin = fromSquare(move.from)
  const target = fromSquare(move.to)
  const push =
    mover?.piece === LEGIONARY &&
    target.rank === CENTRE &&
    origin.rank === CENTRE - step * (CENTRE - 3)
  return {
    position: next,
    rights: {
      castling: kept,
      enPassant: push ? { behind: toSquare(target.file, CENTRE - step), enemy: move.to } : null
    }
  }
}