import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { REACH } from '@/constants/piece'
import { ORTHOGONAL } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const line = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean,
  marshal: string | null,
  df: number,
  dr: number
): Move[] => {
  const origin = fromSquare(from)
  const isFile = df !== 0
  const start = isFile ? origin.file : origin.rank
  const towards = isFile ? df : dr
  let isTowardMarshal = false
  if (marshal !== null) {
    const { file: marshalFile, rank: marshalRank } = fromSquare(marshal)
    isTowardMarshal = ((isFile ? marshalFile : marshalRank) - start) * towards > 0
  }
  const { quiet, capture } = REACH.sentinel[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  let through = false
  for (let distance = 1; distance <= Math.max(quiet, capture); distance += 1) {
    const file = origin.file + df * distance
    const rank = origin.rank + dr * distance
    if (!isOnBoard(file, rank)) break
    const to = toSquare(file, rank)
    const occupant = occupancy[to]
    if (!occupant) {
      if (distance <= quiet) moves.push({ from, to })
      continue
    }
    if (occupant.side !== side) {
      if (!through && distance <= capture && !isDormant(occupant))
        moves.push({ from, to, captures: [to] })
      break
    }
    if (!(isEnhanced && isTowardMarshal)) break
    through = true
  }
  return moves
}
export const sentinel = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean,
  marshal: string | null
): Move[] =>
  ORTHOGONAL.flatMap(([df, dr]) => line(side, occupancy, from, isEnhanced, marshal, df, dr))