import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/board'

const ring = (from: string): string[] => {
  const origin = fromSquare(from)
  const squares: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (isOnBoard(file, rank)) squares.push(toSquare(file, rank))
  }
  return squares
}
const steps = (position: Position, from: string): Move[] =>
  ring(from)
    .filter(to => !position[to])
    .map(to => ({ from, to }))
const blast = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => {
  const victims: string[] = []
  let hasEnemy = false
  for (const to of ring(from)) {
    const occupant = position[to]
    if (!occupant) continue
    if (occupant.side !== side) {
      hasEnemy = true
      victims.push(to)
      continue
    }
    if (isEnhanced) victims.push(to)
  }
  if (!hasEnemy) return []
  if (!isEnhanced) victims.push(from)
  return [{ from, to: from, captures: victims }]
}
export const mage = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => [
  ...steps(position, from),
  ...blast(side, position, from, isEnhanced)
]