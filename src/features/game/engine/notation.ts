import type { Move, Position } from '@/types/game'
import type { FullMove } from '@/types/panel'
import { FILES } from '@/constants/board'
import { POPE, EMPEROR, MARSHAL, LEGIONARY, LETTER } from '@/constants/piece'
import { PLIES_PER_MOVE } from '@/constants/outcome'
import { parseSquare } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { threats } from './threats'

export const fullMoves = (pgn: string): FullMove[] => {
  const plies = pgn
    .split(/ (?!e\.p\.|rip\.)/u)
    .filter(token => token !== '' && !/^\d+\.$/u.test(token))
  return Array.from({ length: Math.ceil(plies.length / PLIES_PER_MOVE) }, (_, index) => ({
    white: plies[index * PLIES_PER_MOVE]!,
    black: plies[index * PLIES_PER_MOVE + 1] ?? null,
    number: index + 1
  }))
}
export const notation = (position: Position, move: Move): string => {
  const { pieces, occupancy, side, state } = position
  const mover = occupancy[move.from]
  if (!mover) return ''
  if (move.sentinel)
    return parseSquare(move.to).file < parseSquare(move.from).file ? 'O-O-O' : 'O-O'
  const letter = mover.piece === LEGIONARY ? '' : LETTER[mover.piece]
  const capture = move.captures === undefined ? '-' : 'x'
  const file = parseSquare(move.to).file
  const riposte =
    mover.piece === MARSHAL &&
    move.captures !== undefined &&
    state.riposte &&
    threats(position, side, {}, false, move.to).length === 0
      ? ' rip.'
      : ''
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
    mover.piece === POPE || mover.piece === EMPEROR || mover.piece === MARSHAL
      ? ''
      : isEnhanced(pieces[side][MARSHAL][0] ?? null, move.from)
        ? '^'
        : ''
  const passing =
    mover.piece === LEGIONARY && move.captures !== undefined && !move.captures.includes(move.to)
      ? ' e.p.'
      : ''
  return `${letter}${move.from}${capture}${move.to}${promotion}${zone}${riposte}${passing}`
}