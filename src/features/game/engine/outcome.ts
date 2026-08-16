import type { Side, SquareOccupant } from '@/types/material'
import type { Move, Position } from '@/types/game'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE } from '@/constants/piece'
import {
  CHECKMATE,
  STALEMATE,
  REPETITION,
  NO_PROGRESS,
  INSUFFICIENT_MATERIAL,
  REPETITION_LIMIT
} from '@/constants/outcome'

// The full list of material is insufficient to mate is still open, so only the one case that needs no
// list is answered here: both Popes alone, where neither side owns anything left to mate with.
const isInsufficientMaterial = (occupancy: SquareOccupant): boolean =>
  Object.values(occupancy).every(occupant => occupant.piece === POPE)
export const outcome = (
  position: Position,
  moves: Move[],
  repetition: number
): {
  winner: Side | null
  reason:
    | typeof CHECKMATE
    | typeof STALEMATE
    | typeof REPETITION
    | typeof NO_PROGRESS
    | typeof INSUFFICIENT_MATERIAL
} | null => {
  const { occupancy, side, checkInfo, state } = position
  if (moves.length === 0)
    return checkInfo.checkers.length > 0
      ? { winner: side === WHITE ? BLACK : WHITE, reason: CHECKMATE }
      : { winner: side, reason: STALEMATE }
  if (state.noProgress.count >= state.noProgress.limit) return { winner: null, reason: NO_PROGRESS }
  if (repetition >= REPETITION_LIMIT)
    return { winner: side === WHITE ? BLACK : WHITE, reason: REPETITION }
  if (isInsufficientMaterial(occupancy)) return { winner: null, reason: INSUFFICIENT_MATERIAL }
  return null
}