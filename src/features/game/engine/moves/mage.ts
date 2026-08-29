import type { Side, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { POPE, REACH } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const ring = (from: string, distance: number): string[] => {
  const origin = parseSquare(from)
  const squares: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const file = origin.file + fileStep * distance
    const rank = origin.rank + rankStep * distance
    if (isOnBoard({ file, rank })) squares.push(makeSquare({ file, rank }))
  }
  return squares
}
const steps = (occupancy: SquareOccupant, from: string, isEnhanced: boolean): Move[] => {
  const squares: string[] = []
  for (
    let distance = 1;
    distance <= REACH.mage[isEnhanced ? ENHANCED : RESTRICTED].quiet;
    distance += 1
  )
    squares.push(...ring(from, distance))
  return squares.filter(to => !occupancy[to]).map(to => ({ from, to }))
}
const blast = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const victims: string[] = []
  let hasEnemy = false
  let ownPope = false
  for (const to of ring(from, 1)) {
    const occupant = occupancy[to]
    if (!occupant) continue
    if (occupant.side !== side) {
      if (isDormant(occupant)) continue
      hasEnemy = true
      victims.push(to)
      continue
    }
    if (occupant.piece === POPE) ownPope = true
    if (!isEnhanced && !isDormant(occupant)) victims.push(to)
  }
  if (!hasEnemy) return []
  if (!isEnhanced && ownPope) return []
  return [{ from, to: from, captures: victims }]
}
export const mage = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => [...steps(occupancy, from, isEnhanced), ...blast(side, occupancy, from, isEnhanced)]