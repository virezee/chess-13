import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { SIZE } from '@/constants/board'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

export const riposteSquares = (side: Side, position: Position, move: Move): string[] =>
  (move.captures ?? []).filter(square => position[square] && position[square].side !== side)
export const marshal = (side: Side, position: Position, from: string): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const to = toSquare(file, rank)
      const occupant = position[to]
      if (!occupant) {
        moves.push({ from, to })
        continue
      }
      if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
      break
    }
  }
  return moves
}