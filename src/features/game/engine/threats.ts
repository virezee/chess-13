import type { Side, Piece, SquareOccupant } from '@/types/material'
import type { Board, View } from '@/types/game'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
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
import { parseSquare, makeSquare, isOnBoard } from '../lib/coordinate'
import { isEnhanced } from './generate'

const occupantAt = (occupancy: SquareOccupant, view: View, square: string): Piece | undefined => {
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
  square: string,
  fileStep: number,
  rankStep: number,
  enhanced: boolean,
  gap: number
): boolean => {
  const reach = REACH.assassin[enhanced ? ENHANCED : RESTRICTED].reach
  if (CORNERS.includes(square)) return gap <= reach
  if (gap + 1 > reach) return false
  const target = parseSquare(square)
  const file = target.file - fileStep
  const rank = target.rank - rankStep
  if (!isOnBoard(file, rank)) return false
  return !occupantAt(occupancy, view, makeSquare(file, rank))
}
export const leapers = (
  board: Board,
  side: Side,
  view: View,
  marshalSquare: string | null,
  square: string
): string[] => {
  const { pieces, occupancy } = board
  if (pieces[side][TEMPLAR].length === 0) return []
  const origin = parseSquare(square)
  const templars: string[] = []
  for (const [offsets, enhancedOnly] of [
    [LEAP_3_2, false],
    [LEAP_2_1, true]
  ] as const) {
    for (const [fileStep, rankStep] of offsets) {
      const file = origin.file + fileStep
      const rank = origin.rank + rankStep
      if (!isOnBoard(file, rank)) continue
      const from = makeSquare(file, rank)
      const occupant = occupantAt(occupancy, view, from)
      if (!occupant || occupant.side !== side || occupant.piece !== TEMPLAR) continue
      if (enhancedOnly && !isEnhanced(marshalSquare, from)) continue
      templars.push(from)
    }
  }
  return templars
}
export const threats = (
  board: Board,
  side: Side,
  view: View = {},
  dormant: boolean,
  square: string
): string[] => {
  const { pieces, occupancy } = board
  const marshalSq = pieces[side][MARSHAL][0] ?? null
  const origin = parseSquare(square)
  const victim = occupantAt(occupancy, view, square)
  const isEnemyPope = victim?.piece === POPE && victim.side !== side
  const attackers: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const from = makeSquare(file, rank)
      const occupant = occupantAt(occupancy, view, from)
      if (!occupant) continue
      if (occupant.side !== side) break
      const enhanced = isEnhanced(marshalSq, from)
      if (occupant.piece === MARSHAL) {
        if (isEnemyPope) attackers.push(from)
      } else if (occupant.piece === ASSASSIN) {
        const dest = CORNERS.includes(square)
          ? square
          : makeSquare(origin.file - fileStep, origin.rank - rankStep)
        if (
          assassinReaches(occupancy, view, square, fileStep, rankStep, enhanced, distance) &&
          !threats(board, side === WHITE ? BLACK : WHITE, view, false, dest).some(
            defender => defender !== square
          )
        )
          attackers.push(from)
      } else if (reaches(occupant, dormant, isDiagonal, rankStep, enhanced, distance))
        attackers.push(from)
      break
    }
  }
  attackers.push(...leapers(board, side, view, marshalSq, square))
  return attackers
}