import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { LEAP } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/aura'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/lib/coordinate'

export const templar = (
  side: Side,
  position: Position,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of LEAP.templar[isEnhanced ? ENHANCED : RESTRICTED]) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = toSquare(file, rank)
    const occupant = position[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (occupant.side !== side) moves.push({ from, to, captures: [to] })
  }
  return moves
}