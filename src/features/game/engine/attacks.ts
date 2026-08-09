import type { Side, PieceName, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { COMMAND_SQUARE } from '@/constants/board'
import { AURA_RANGE } from '@/constants/aura'
import { fromSquare } from '@/features/game/board'
import {
  // POPE,
  // EMPEROR,
  MARSHAL,
  // ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY
} from '@/constants/piece'
import { legionary } from './moves/legionary'
import { templar } from './moves/templar'
import { herald } from './moves/herald'
import { mage } from './moves/mage'
import { sentinel } from './moves/sentinel'

const marshalSquare = (side: Side, position: Position): string | null => {
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side === side && piece.piece === MARSHAL) return square
  }
  return null
}
const isEnhanced = (marshal: string | null, square: string): boolean => {
  if (marshal === null) return false
  if (marshal === COMMAND_SQUARE) return true
  const at = fromSquare(marshal)
  const here = fromSquare(square)
  return Math.max(Math.abs(at.file - here.file), Math.abs(at.rank - here.rank)) <= AURA_RANGE
}
const generate = (
  side: Side,
  piece: PieceName,
  position: Position,
  marshal: string | null,
  square: string
): Move[] => {
  const enhanced = isEnhanced(marshal, square)
  switch (piece) {
    case SENTINEL:
      return sentinel(side, position, square, enhanced, marshal)
    case MAGE:
      return mage(side, position, square, enhanced)
    case HERALD:
      return herald(side, position, square, enhanced)
    case TEMPLAR:
      return templar(side, position, square, enhanced)
    case LEGIONARY:
      return legionary(side, position, square, enhanced, null, [])
    default:
      return []
  }
}
export const attacks = (side: Side, position: Position): Set<string> => {
  const marshal = marshalSquare(side, position)
  const attacked = new Set<string>()
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side !== side) continue
    for (const move of generate(side, piece.piece, position, marshal, square)) {
      for (const target of move.captures ?? []) attacked.add(target)
    }
  }
  return attacked
}