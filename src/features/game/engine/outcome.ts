import type { Side, SquareOccupant } from '@/types/material'
import type { Move, State, Position } from '@/types/game'
import { SIZE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, LETTER } from '@/constants/piece'
import {
  CHECKMATE,
  STALEMATE,
  REPETITION,
  NO_PROGRESS,
  INSUFFICIENT_MATERIAL,
  REPETITION_LIMIT
} from '@/constants/outcome'
import { makeSquare } from '../lib/coordinate'

// The full list of material is insufficient to mate is still open, so only the one case that needs no
// list is answered here: both Popes alone, where neither side owns anything left to mate with.
const isInsufficientMaterial = (occupancy: SquareOccupant): boolean =>
  Object.values(occupancy).every(occupant => occupant.piece === POPE)
const placement = (occupancy: SquareOccupant): string => {
  const ranks: string[] = []
  for (let rank = SIZE; rank >= 1; rank -= 1) {
    let written = ''
    let empty = 0
    for (let file = 0; file < SIZE; file += 1) {
      const occupant = occupancy[makeSquare({ file, rank })]
      if (!occupant) {
        empty += 1
        continue
      }
      if (empty > 0) written += empty
      empty = 0
      written +=
        occupant.side === WHITE ? LETTER[occupant.piece] : LETTER[occupant.piece].toLowerCase()
    }
    if (empty > 0) written += empty
    ranks.push(written)
  }
  return ranks.join('/')
}
const castling = (castlingSide: State['castlingSide']): string => {
  const written = ([WHITE, BLACK] as const)
    .map(colour => {
      const { left, right } = castlingSide[colour]
      const wings = `${left ? 'E' : ''}${right ? 'M' : ''}`
      return colour === WHITE ? wings : wings.toLowerCase()
    })
    .join('')
  return written === '' ? '-' : written
}
export const repetitionKey = (side: Side, occupancy: SquareOccupant, state: State): string =>
  [
    placement(occupancy),
    side === WHITE ? 'w' : 'b',
    state.riposte ? 'r' : '-',
    castling(state.castlingSide),
    state.enPassant?.target ?? '-'
  ].join(' ')
export const repetitionCount = (key: string, history: readonly string[]): number =>
  history.filter(entry => entry === key).length + 1
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