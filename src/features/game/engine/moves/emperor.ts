import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { SIZE } from '@/constants/board'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/lib/coordinate'

export const emperor = (side: Side, position: Position, from: string): Move[] => {
  if (position[from]?.awake !== true) return []
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
      if (occupant.side !== side) moves.push({ from, to, captures: [to] })
      break
    }
  }
  return moves
}