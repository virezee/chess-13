import type { Side, PieceName, Position } from '@/types/piece'
import type { Move, Castling, EnPassant, PromotionSlot } from '@/types/move'
import { COMMAND_SQUARE } from '@/constants/board'
import {
  POPE,
  EMPEROR,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY
} from '@/constants/piece'
import { AURA_RANGE } from '@/constants/aura'
import { fromSquare } from '../lib/coordinate'
import {
  pope,
  emperor,
  marshal,
  assassin,
  sentinel,
  mage,
  herald,
  templar,
  legionary
} from './moves'

export const isEnhanced = (marshalSquare: string | null, square: string): boolean => {
  if (marshalSquare === null) return false
  if (marshalSquare === COMMAND_SQUARE) return true
  const at = fromSquare(marshalSquare)
  const here = fromSquare(square)
  return Math.max(Math.abs(at.file - here.file), Math.abs(at.rank - here.rank)) <= AURA_RANGE
}
export const generate = (
  side: Side,
  piece: PieceName,
  position: Position,
  marshalSquare: string | null,
  square: string,
  castling: Castling,
  enPassant: EnPassant | null,
  promotionSlots: PromotionSlot[]
): Move[] => {
  if (piece === POPE) return pope(side, position, square, castling)
  if (piece === EMPEROR) return emperor(side, position, square)
  if (piece === MARSHAL) return marshal(side, position, square)
  const enhanced = isEnhanced(marshalSquare, square)
  switch (piece) {
    case ASSASSIN:
      return assassin(side, position, square, enhanced)
    case SENTINEL:
      return sentinel(side, position, square, enhanced, marshalSquare)
    case MAGE:
      return mage(side, position, square, enhanced)
    case HERALD:
      return herald(side, position, square, enhanced)
    case TEMPLAR:
      return templar(side, position, square, enhanced)
    case LEGIONARY:
      return legionary(side, position, square, enhanced, enPassant, promotionSlots)
    default: {
      // Every piece name has a branch. A new one has to be wired in here or this fails to compile.
      const unwired: never = piece
      return unwired
    }
  }
}