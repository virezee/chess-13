import type { Side, Piece, Position } from '@/types/piece'
import type { View } from '@/types/move'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE } from '@/constants/colour'
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
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/aura'
import { fromSquare, toSquare, isOnBoard, squareOf } from '../lib/coordinate'
import { isEnhanced } from './generate'

export const occupantAt = (position: Position, view: View, square: string): Piece | undefined => {
  if (view.moved && view.moved.square === square) return view.moved.piece
  if (view.vacated?.includes(square)) return
  return position[square]
}
export const reaches = (
  piece: Piece,
  isDiagonal: boolean,
  rankStep: number,
  distance: number,
  enhanced: boolean
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
export const assassinReaches = (
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
export const threats = (
  side: Side,
  position: Position,
  square: string,
  view: View = {}
): string[] => {
  const marshalSquare = squareOf(side, MARSHAL, position)
  const origin = fromSquare(square)
  const target = occupantAt(position, view, square)
  const marshalCounts = target?.piece === POPE && target.side !== side
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
        if (marshalCounts) found.push(at)
      } else if (occupant.piece === ASSASSIN) {
        if (assassinReaches(position, view, square, fileStep, rankStep, distance, enhanced))
          found.push(at)
      } else if (reaches(occupant, isDiagonal, rankStep, distance, enhanced)) found.push(at)
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