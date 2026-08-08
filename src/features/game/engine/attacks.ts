import type { Side, Position, PieceName } from '@/types/piece'
import type { Move } from '@/types/move'
import { CENTRE } from '@/constants/board'
import { toSquare, fromSquare } from '@/features/game/board'
import { legionary } from './moves/legionary'
import { sentinel } from './moves/sentinel'
import { templar } from './moves/templar'
import { herald } from './moves/herald'
import { mage } from './moves/mage'

const AURA_RANGE = 4
const COMMAND_SQUARE = toSquare(CENTRE - 1, CENTRE)

const marshalSquare = (position: Position, side: Side): string | null => {
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side === side && piece.piece === 'marshal') return square
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
  position: Position,
  square: string,
  piece: PieceName,
  marshal: string | null
): Move[] => {
  const enhanced = isEnhanced(marshal, square)
  switch (piece) {
    case 'legionary':
      return legionary(side, position, square, enhanced, null, [])
    case 'sentinel':
      return sentinel(side, position, square, enhanced, marshal)
    case 'templar':
      return templar(side, position, square, enhanced)
    case 'herald':
      return herald(side, position, square, enhanced)
    case 'mage':
      return mage(side, position, square, enhanced)
    default:
      return []
  }
}
export const attacks = (position: Position, side: Side): Set<string> => {
  const marshal = marshalSquare(position, side)
  const attacked = new Set<string>()
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side !== side) continue
    for (const move of generate(side, position, square, piece.piece, marshal)) {
      for (const target of move.captures ?? []) attacked.add(target)
    }
  }
  return attacked
}