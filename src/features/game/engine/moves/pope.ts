import type { Side, Position } from '@/types/piece'
import type { Move, Castling, Wing } from '@/types/move'
import { SENTINEL, CASTLING } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const castle = (side: Side, position: Position, from: string, wing: Wing): Move | null => {
  const sentinel = position[wing.sentinel]
  if (!sentinel || sentinel.side !== side || sentinel.piece !== SENTINEL) return null
  if (wing.between.some(square => position[square])) return null
  return { from, to: wing.to, sentinel: { from: wing.sentinel, to: wing.lands } }
}
export const pope = (side: Side, position: Position, from: string, castling: Castling): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = toSquare(file, rank)
    const occupant = position[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
  }
  const wings = CASTLING[side]
  if (from !== wings.home) return moves
  for (const [available, wing] of [
    [castling.left, wings.left],
    [castling.right, wings.right]
  ] as const) {
    if (!available) continue
    const move = castle(side, position, from, wing)
    if (move) moves.push(move)
  }
  return moves
}