import type { Side, PieceName, SquareOccupant } from '@/types/material'
import type { Move, CastlingSide, Promotion, EnPassant } from '@/types/game'
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
import { RANGE } from '@/constants/zone'
import { parseSquare } from '../lib/coordinate'
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
  const marshalSq = parseSquare(marshalSquare)
  const { file, rank } = parseSquare(square)
  return Math.max(Math.abs(marshalSq.file - file), Math.abs(marshalSq.rank - rank)) <= RANGE
}
export const generate = (
  side: Side,
  piece: PieceName,
  occupancy: SquareOccupant,
  marshalSquare: string | null,
  square: string,
  castlingSide: CastlingSide,
  promotions: Promotion[],
  enPassant: EnPassant | null
): Move[] => {
  if (piece === POPE) return pope(side, occupancy, square, castlingSide)
  if (piece === EMPEROR) return emperor(side, occupancy, square)
  if (piece === MARSHAL) return marshal(side, occupancy, square)
  const enhanced = isEnhanced(marshalSquare, square)
  switch (piece) {
    case ASSASSIN:
      return assassin(side, occupancy, square, enhanced)
    case SENTINEL:
      return sentinel(side, occupancy, square, enhanced, marshalSquare)
    case MAGE:
      return mage(side, occupancy, square, enhanced)
    case HERALD:
      return herald(side, occupancy, square, enhanced)
    case TEMPLAR:
      return templar(side, occupancy, square, enhanced)
    case LEGIONARY:
      return legionary(side, occupancy, square, enhanced, promotions, enPassant)
    default: {
      // Every piece name has a branch. A new one has to be wired in here or this fails to compile.
      const unwired: never = piece
      return unwired
    }
  }
}