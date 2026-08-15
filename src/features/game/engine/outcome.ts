import type { Side } from '@/types/material'
import type { Move, Position } from '@/types/game'
import { WHITE, BLACK } from '@/constants/colour'
import {
  CHECKMATE,
  STALEMATE,
  REPETITION,
  NO_PROGRESS,
  REPETITION_LIMIT
} from '@/constants/outcome'

export const outcome = (
  position: Position,
  moves: Move[],
  repetition: number
): {
  reason: typeof CHECKMATE | typeof STALEMATE | typeof REPETITION | typeof NO_PROGRESS
  winner: Side | null
} | null => {
  const { side, checkInfo, state } = position
  if (moves.length === 0)
    return checkInfo.checkers.length > 0
      ? { reason: CHECKMATE, winner: side === WHITE ? BLACK : WHITE }
      : { reason: STALEMATE, winner: side }
  if (repetition >= REPETITION_LIMIT) return { reason: REPETITION, winner: side }
  if (state.noProgress >= state.noProgressLimit) return { reason: NO_PROGRESS, winner: null }
  return null
}