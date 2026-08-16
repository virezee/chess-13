import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { REACH } from '@/constants/piece'
import { ORTHOGONAL } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const line = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  marshalSquare: string | null,
  isEnhanced: boolean,
  fileDelta: number,
  rankDelta: number
): Move[] => {
  const origin = parseSquare(from)
  const isAlongRank = fileDelta !== 0
  const axisOrigin = isAlongRank ? origin.file : origin.rank
  const axisStep = isAlongRank ? fileDelta : rankDelta
  let isTowardMarshal = false
  if (marshalSquare !== null) {
    const { file: marshalFile, rank: marshalRank } = parseSquare(marshalSquare)
    isTowardMarshal = ((isAlongRank ? marshalFile : marshalRank) - axisOrigin) * axisStep > 0
  }
  const { quiet, capture } = REACH.sentinel[isEnhanced ? ENHANCED : RESTRICTED]
  const moves: Move[] = []
  let through = false
  for (let distance = 1; distance <= Math.max(quiet, capture); distance += 1) {
    const file = origin.file + fileDelta * distance
    const rank = origin.rank + rankDelta * distance
    if (!isOnBoard(file, rank)) break
    const to = makeSquare(file, rank)
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
  marshalSquare: string | null,
  isEnhanced: boolean
): Move[] =>
  ORTHOGONAL.flatMap(([fileDelta, rankDelta]) =>
    line(side, occupancy, from, marshalSquare, isEnhanced, fileDelta, rankDelta)
  )