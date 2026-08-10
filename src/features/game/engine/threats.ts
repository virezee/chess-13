import type { Side, Piece, Position } from '@/types/piece'
import type { View } from '@/types/move'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE } from '@/constants/colour'
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/aura'
import {
  POPE,
  EMPEROR,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY,
  REACH
} from '@/constants/piece'
import { fromSquare, toSquare, isOnBoard, squareOf } from '../lib/coordinate'
import { occupantAt } from '../lib/view'
import { isEnhanced } from './generate'

const reaches = (
  piece: Piece,
  enhanced: boolean,
  isDiagonal: boolean,
  rankStep: number,
  distance: number
): boolean => {
  switch (piece.piece) {
    case EMPEROR:
      return piece.awake === true
    case SENTINEL:
      return !isDiagonal && distance <= REACH.sentinel[enhanced ? ENHANCED : RESTRICTED].capture
    case MAGE:
    case POPE:
      return distance === 1
    case HERALD:
      return isDiagonal
        ? distance <= REACH.herald[enhanced ? ENHANCED : RESTRICTED].diagonal
        : distance === 1 && enhanced
    case LEGIONARY:
      return isDiagonal && distance === 1 && rankStep === (piece.side === WHITE ? -1 : 1)
    default:
      return false
  }
}
const assassinReaches = (
  position: Position,
  view: View,
  target: string,
  fileStep: number,
  rankStep: number,
  gap: number,
  enhanced: boolean
): boolean => {
  const reach = REACH.assassin[enhanced ? ENHANCED : RESTRICTED].reach
  if (CORNERS.includes(target)) return gap <= reach
  if (gap + 1 > reach) return false
  const at = fromSquare(target)
  const file = at.file - fileStep
  const rank = at.rank - rankStep
  if (!isOnBoard(file, rank)) return false
  return !occupantAt(position, view, toSquare(file, rank))
}
/**
 * The squares `side` bears on `square` from, found by standing on the square and
 * looking outward rather than by generating moves. The Marshal is left out
 * unless the square holds a Pope, because against anything else it needs a
 * friendly attacker already there, and that attacker turns up in this same scan.
 * A dormant Emperor is left out because it guards nothing.
 */

/** Whether `to` sits on the ray that leaves `from` in the given direction. */

export interface PopeScan {
  /** Enemy pieces giving check right now. */
  checkers: string[]
  /** Own pieces that may not leave their line, and the line they stand on. */
  pinned: Map<string, readonly [number, number]>
}

export const threats = (
  side: Side,
  position: Position,
  square: string,
  view: View = {},
  againstPope = false
): string[] => {
  const marshalSquare = squareOf(side, MARSHAL, position)
  const origin = fromSquare(square)
  const found: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const at = toSquare(file, rank)
      const occupant = occupantAt(position, view, at)
      if (!occupant) continue
      if (occupant.side !== side) break
      const enhanced = isEnhanced(marshalSquare, at)
      if (occupant.piece === MARSHAL) {
        if (againstPope) found.push(at)
      } else if (occupant.piece === ASSASSIN) {
        if (assassinReaches(position, view, square, fileStep, rankStep, distance, enhanced)) {
          found.push(at)
        }
      } else if (reaches(occupant, enhanced, isDiagonal, rankStep, distance)) {
        found.push(at)
      }
      break
    }
  }
  for (const [offsets, needsAura] of [
    [LEAP_3_2, false],
    [LEAP_2_1, true]
  ] as const) {
    for (const [fileStep, rankStep] of offsets) {
      const file = origin.file + fileStep
      const rank = origin.rank + rankStep
      if (!isOnBoard(file, rank)) continue
      const at = toSquare(file, rank)
      const occupant = occupantAt(position, view, at)
      if (!occupant || occupant.side !== side || occupant.piece !== TEMPLAR) continue
      if (needsAura && !isEnhanced(marshalSquare, at)) continue
      found.push(at)
    }
  }
  return found
}