import type { Side, PieceSquares, SquareOccupant } from '@/types/material'
import type { Move, EnPassant, Board, Position, Step, State } from '@/types/game'
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
import { fromSquare, toSquare } from '../lib/coordinate'
import { threats } from './threats'
import { checkInfo, dormantEmperor } from './legality'
import { riposteSquares } from './moves'

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
const lists = (occupancy: SquareOccupant): Record<Side, PieceSquares> => {
  const found = { [WHITE]: empty(), [BLACK]: empty() }
  for (const [square, piece] of Object.entries(occupancy))
    found[piece.side][piece.piece].push(square)
  return found
}
const awaken = (board: Board, side: Side): SquareOccupant => {
  const { pieces, occupancy } = board
  const square = dormantEmperor(board, side)
  if (square === null) return occupancy
  const enemy = side === WHITE ? BLACK : WHITE
  if (
    pieces[side][MARSHAL][0] !== undefined &&
    !threats(board, enemy, {}, false, square).some(from => occupancy[from]?.piece !== MAGE)
  )
    return occupancy
  return { ...occupancy, [square]: { ...occupancy[square]!, awake: true } }
}
const clearLine = (occupancy: SquareOccupant, { from, to }: Step): boolean => {
  if (from === to) return false
  const origin = fromSquare(from)
  const target = fromSquare(to)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  for (let step = 1; step < distance; step += 1) {
    if (occupancy[toSquare(origin.file + fileStep * step, origin.rank + rankStep * step)])
      return false
  }
  return true
}
export const position = (
  side: Side,
  occupancy: SquareOccupant,
  castlingSide: State['castlingSide'],
  promotions: State['promotions'],
  last: { occupancy: SquareOccupant; move: Move } | null = null,
  enPassant: EnPassant | null = null,
  noProgress = 0,
  noProgressLimit = 0
): Position => {
  const pieces = lists(occupancy)
  const awake = awaken({ pieces, occupancy }, side)
  const board: Board = { pieces, occupancy: awake }
  const enemy = side === WHITE ? BLACK : WHITE
  const marshalSquare = pieces[side][MARSHAL][0]
  const victims = last === null ? [] : riposteSquares(enemy, last.occupancy, last.move)
  const riposte =
    marshalSquare !== undefined &&
    victims.some(square => clearLine(awake, { from: marshalSquare, to: square }))
  return {
    ...board,
    side,
    checkInfo: checkInfo(board, side),
    state: { castlingSide, promotions, enPassant, riposte, noProgress, noProgressLimit }
  }
}