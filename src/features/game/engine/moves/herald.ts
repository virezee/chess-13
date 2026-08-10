import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { REACH } from '@/constants/piece'
import { DIAGONAL, ORTHOGONAL } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/aura'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/lib/coordinate'

const diagonals = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => {
  const origin = fromSquare(from)
  const { diagonal } = REACH.herald[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  for (const [fileStep, rankStep] of DIAGONAL) {
    for (let distance = 1; distance <= diagonal; distance += 1) {
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
const steps = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of ORTHOGONAL) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = toSquare(file, rank)
    const occupant = position[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (isEnhanced && occupant.side !== side) moves.push({ from, to, captures: [to] })
  }
  return moves
}
export const herald = (
  side: Side,
  position: Position,
  from: string,
  isEnhanced: boolean
): Move[] => [
  ...diagonals(side, position, from, isEnhanced),
  ...steps(side, position, from, isEnhanced)
]