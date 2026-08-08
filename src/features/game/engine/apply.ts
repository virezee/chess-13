import type { Position } from '@/types/piece'
import type { Move } from '@/types/move'

export const apply = (position: Position, move: Move): Position => {
  const next = { ...position }
  const mover = next[move.from]
  delete next[move.from]
  move.captures?.forEach(square => delete next[square])
  if (!mover || move.captures?.includes(move.from)) return next
  next[move.to] = move.promotesTo ? { side: mover.side, piece: move.promotesTo } : mover
  return next
}