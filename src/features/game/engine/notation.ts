import type { Move, Position } from '@/types/game'
import { FILES } from '@/constants/board'
import { POPE, EMPEROR, MARSHAL, LEGIONARY, LETTER } from '@/constants/piece'
import { parseSquare } from '../lib/coordinate'
import { isEnhanced } from './generate'

export const notation = (position: Position, move: Move): string => {
  const { pieces, occupancy, side, state } = position
  const mover = occupancy[move.from]
  if (!mover) return ''
  if (move.sentinel)
    return parseSquare(move.to).file < parseSquare(move.from).file ? 'O-O-O' : 'O-O'
  const letter = mover.piece === LEGIONARY ? '' : LETTER[mover.piece]
  const capture = move.captures === undefined ? '-' : 'x'
  const file = parseSquare(move.to).file
  const promSlots =
    move.promotesTo === undefined
      ? []
      : state.promotions[side].filter(
          slot => slot.piece.includes(move.promotesTo!) && Math.abs(slot.file - file) <= 1
        )
  const promotion =
    move.promotesTo === undefined
      ? ''
      : `=${LETTER[move.promotesTo]}${promSlots.length > 1 ? FILES[promSlots[0]!.file] : ''}`
  const zone =
    mover.piece === POPE || mover.piece === EMPEROR
      ? ''
      : isEnhanced(pieces[side][MARSHAL][0] ?? null, move.from)
        ? '^'
        : ''
  return `${letter}${move.from}${capture}${move.to}${promotion}${zone}`
}