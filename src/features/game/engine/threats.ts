import type { Side, Piece, SquareOccupant } from '@/types/material'
import type { Board, View } from '@/types/game'
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
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { fromSquare, toSquare, isOnBoard } from '../lib/coordinate'
import { isEnhanced } from './generate'

export const occupantAt = (
  occupancy: SquareOccupant,
  view: View,
  square: string
): Piece | undefined => {
  if (view.moved && view.moved.square === square) return view.moved.piece
  if (view.vacated?.includes(square)) return
  return occupancy[square]
}
export const reaches = (
  piece: Piece,
  dormant: boolean,
  isDiagonal: boolean,
  rankStep: number,
  enhanced: boolean,
  distance: number
): boolean => {
  switch (piece.piece) {
    case EMPEROR:
      return piece.awake === true || dormant
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
  occupancy: SquareOccupant,
  view: View,
  target: string,
  fileStep: number,
  rankStep: number,
  enhanced: boolean,
  gap: number
): boolean => {
  const reach = REACH.assassin[enhanced ? ENHANCED : RESTRICTED].reach
  if (CORNERS.includes(target)) return gap <= reach
  if (gap + 1 > reach) return false
  const at = fromSquare(target)
  const file = at.file - fileStep
  const rank = at.rank - rankStep
  if (!isOnBoard(file, rank)) return false
  return !occupantAt(occupancy, view, toSquare(file, rank))
}
export const leapers = (
  side: Side,
  occupancy: SquareOccupant,
  view: View,
  marshalSquare: string | null,
  square: string
): string[] => {
  if (!Object.values(occupancy).some(piece => piece.side === side && piece.piece === TEMPLAR))
    return []
  const origin = fromSquare(square)
  const found: string[] = []
  for (const [offsets, needsAura] of [
    [LEAP_3_2, false],
    [LEAP_2_1, true]
  ] as const) {
    for (const [fileStep, rankStep] of offsets) {
      const file = origin.file + fileStep
      const rank = origin.rank + rankStep
      if (!isOnBoard(file, rank)) continue
      const at = toSquare(file, rank)
      const occupant = occupantAt(occupancy, view, at)
      if (!occupant || occupant.side !== side || occupant.piece !== TEMPLAR) continue
      if (needsAura && !isEnhanced(marshalSquare, at)) continue
      found.push(at)
    }
  }
  return found
}
export const threats = (
  board: Board,
  side: Side,
  view: View = {},
  dormant: boolean,
  square: string
): string[] => {
  const { pieces, occupancy } = board
  const marshalSquare = pieces[side][MARSHAL][0] ?? null
  const origin = fromSquare(square)
  const target = occupantAt(occupancy, view, square)
  const marshalCounts = target?.piece === POPE && target.side !== side
  const found: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const at = toSquare(file, rank)
      const occupant = occupantAt(occupancy, view, at)
      if (!occupant) continue
      if (occupant.side !== side) break
      const enhanced = isEnhanced(marshalSquare, at)
      if (occupant.piece === MARSHAL) {
        if (marshalCounts) found.push(at)
      } else if (occupant.piece === ASSASSIN) {
        if (assassinReaches(occupancy, view, square, fileStep, rankStep, enhanced, distance))
          found.push(at)
      } else if (reaches(occupant, dormant, isDiagonal, rankStep, enhanced, distance))
        found.push(at)
      break
    }
  }
  found.push(...leapers(side, occupancy, view, marshalSquare, square))
  return found
}