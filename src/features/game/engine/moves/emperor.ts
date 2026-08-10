import type { Side, Piece, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { SIZE } from '@/constants/board'
import { EMPEROR } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/lib/coordinate'

export const isDormant = (piece: Piece): boolean => piece.piece === EMPEROR && piece.awake !== true
export const emperor = (side: Side, position: Position, from: string): Move[] => {
  const self = position[from]
  if (!self || isDormant(self)) return []
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