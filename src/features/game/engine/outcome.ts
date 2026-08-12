import type { Side } from '@/types/piece'
import type { Move, Turn } from '@/types/move'
import { WHITE, BLACK } from '@/constants/colour'
import {
  CHECKMATE,
  STALEMATE,
  REPETITION,
  NO_PROGRESS,
  REPETITION_LIMIT,
  MOVES_PER_TURN,
  NO_PROGRESS_BASE,
  NO_PROGRESS_STEP,
  NO_PROGRESS_PIECES
} from '@/constants/outcome'

export const outcome = (
  turn: Turn,
  moves: Move[]
): {
  reason: typeof CHECKMATE | typeof STALEMATE | typeof REPETITION | typeof NO_PROGRESS
  winner: Side | null
} | null => {
  if (moves.length === 0)
    return turn.checkers.length > 0
      ? { reason: CHECKMATE, winner: turn.side === WHITE ? BLACK : WHITE }
      : { reason: STALEMATE, winner: turn.side }
  if (turn.repetition >= REPETITION_LIMIT) return { reason: REPETITION, winner: turn.side }
  const pieces = Object.keys(turn.position).length
  if (
    turn.idle >=
    MOVES_PER_TURN * (NO_PROGRESS_BASE + NO_PROGRESS_STEP * (NO_PROGRESS_PIECES - pieces))
  )
    return { reason: NO_PROGRESS, winner: null }
  return null
}