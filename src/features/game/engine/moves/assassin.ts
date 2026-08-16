import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { CORNERS } from '@/constants/board'
import { REACH } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

export const assassin = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = parseSquare(from)
  const { reach } = REACH.assassin[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    for (let distance = 1; distance <= reach; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const to = makeSquare(file, rank)
      const occupant = occupancy[to]
      if (!occupant) {
        moves.push({ from, to })
        continue
      }
      if (occupant.side === side || isDormant(occupant)) break
      if (CORNERS.includes(to)) {
        moves.push({ from, to, captures: [to] })
        break
      }
      if (distance + 1 > reach) break
      const landFile = file + fileStep
      const landRank = rank + rankStep
      if (!isOnBoard(landFile, landRank)) break
      const landing = makeSquare(landFile, landRank)
      if (!occupancy[landing]) moves.push({ from, to: landing, captures: [to] })
      break
    }
  }
  return moves
}