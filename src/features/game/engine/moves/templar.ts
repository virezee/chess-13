import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { LEAP } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

export const templar = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = parseSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of LEAP.templar[isEnhanced ? ENHANCED : RESTRICTED]) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard({ file, rank })) continue
    const to = makeSquare({ file, rank })
    const occupant = occupancy[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
  }
  return moves
}