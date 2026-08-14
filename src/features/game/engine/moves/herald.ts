import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { REACH } from '@/constants/piece'
import { DIAGONAL, ORTHOGONAL } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const diagonals = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = fromSquare(from)
  const { diagonal } = REACH.herald[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  for (const [fileStep, rankStep] of DIAGONAL) {
    for (let distance = 1; distance <= diagonal; distance += 1) {
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
const steps = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of ORTHOGONAL) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = toSquare(file, rank)
    const occupant = occupancy[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (isEnhanced && occupant.side !== side && !isDormant(occupant))
      moves.push({ from, to, captures: [to] })
  }
  return moves
}
export const herald = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => [
  ...diagonals(side, occupancy, from, isEnhanced),
  ...steps(side, occupancy, from, isEnhanced)
]