import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { SIZE } from '@/constants/board'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

export const riposteSquares = (side: Side, occupancy: SquareOccupant, move: Move): string[] =>
  (move.captures ?? []).filter(square => occupancy[square] && occupancy[square].side !== side)
export const marshal = (side: Side, occupancy: SquareOccupant, from: string): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const to = toSquare(file, rank)
      const occupant = occupancy[to]
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