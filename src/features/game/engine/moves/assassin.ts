import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { CORNERS } from '@/constants/board'
import { REACH } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

export const assassin = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = fromSquare(from)
  const { reach } = REACH.assassin[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    for (let distance = 1; distance <= reach; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const square = toSquare(file, rank)
      const occupant = occupancy[square]
      if (!occupant) {
        moves.push({ from, to: square })
        continue
      }
      if (occupant.side === side || isDormant(occupant)) break
      if (CORNERS.includes(square)) {
        moves.push({ from, to: square, captures: [square] })
        break
      }
      if (distance + 1 > reach) break
      const landingFile = file + fileStep
      const landingRank = rank + rankStep
      if (!isOnBoard(landingFile, landingRank)) break
      const landing = toSquare(landingFile, landingRank)
      if (!occupancy[landing]) moves.push({ from, to: landing, captures: [square] })
      break
    }
  }
  return moves
}