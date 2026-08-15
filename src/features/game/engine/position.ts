import type { Side, PieceSquares, SquareOccupant } from '@/types/material'
import type { Board, Position, State } from '@/types/game'
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
  LEGIONARY
} from '@/constants/piece'
import { threats } from './threats'
import { checkInfo, dormantSquare } from './legality'

const empty = (): PieceSquares => ({
  [POPE]: [],
  [EMPEROR]: [],
  [MARSHAL]: [],
  [ASSASSIN]: [],
  [SENTINEL]: [],
  [MAGE]: [],
  [HERALD]: [],
  [TEMPLAR]: [],
  [LEGIONARY]: []
})
const lists = (occupancy: SquareOccupant): Board['pieces'] => {
  const pieces = { [WHITE]: empty(), [BLACK]: empty() }
  for (const [square, piece] of Object.entries(occupancy))
    pieces[piece.side][piece.piece].push(square)
  return pieces
}
const awaken = (board: Board, side: Side, awake: boolean): SquareOccupant => {
  const { pieces, occupancy } = board
  const square = dormantSquare(board, side)
  if (square === null) return occupancy
  const enemy = side === WHITE ? BLACK : WHITE
  const marshalSq = pieces[side][MARSHAL][0] ?? null
  if (
    !awake &&
    marshalSq !== null &&
    !threats(board, enemy, {}, false, square).some(from => occupancy[from]?.piece !== MAGE)
  )
    return occupancy
  return { ...occupancy, [square]: { ...occupancy[square]!, awake: true } }
}
export const position = (side: Side, occupancy: SquareOccupant, state: State): Position => {
  const pieces = lists(occupancy)
  const { awake } = state
  const board: Board = { pieces, occupancy: awaken({ pieces, occupancy }, side, awake[side]) }
  const kept: State['awake'] = {
    ...awake,
    [side]: awake[side] || dormantEmperor(board, side) === null
  }
  return {
    ...board,
    side,
    checkInfo: checkInfo({ pieces, occupancy }, side),
    state: { ...state, awake: kept }
  }
}