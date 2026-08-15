import type { Side, PieceList, Position } from '@/types/material'
import type { Move, Castling, EnPassant, PromotionSlot, Board, Turn } from '@/types/game'
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
import { fromSquare, toSquare, squareOf } from '../lib/coordinate'
import { scanPope, dormantEmperor, isAttackedLegally } from './legality'
import { riposteSquares } from './moves'

const empty = (): PieceList => ({
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
const lists = (position: Position): Record<Side, PieceList> => {
  const found = { [WHITE]: empty(), [BLACK]: empty() }
  for (const [square, piece] of Object.entries(position)) found[piece.side][piece.piece].push(square)
  return found
}
const awaken = (side: Side, board: Board): Position => {
  const { position } = board
  const square = dormantEmperor(side, position)
  if (square === null) return position
  const enemy = side === WHITE ? BLACK : WHITE
  if (squareOf(side, MARSHAL, position) !== null && !isAttackedLegally(enemy, board, square))
    return position
  return { ...position, [square]: { ...position[square], awake: true } }
}
const clearLine = (position: Position, from: string, to: string): boolean => {
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
    if (position[toSquare(origin.file + fileStep * step, origin.rank + rankStep * step)])
      return false
  }
  return true
}
export const turn = (
  side: Side,
  board: Position,
  last: { position: Position; move: Move } | null = null,
  castling: Castling,
  enPassant: EnPassant | null = null,
  promotionSlots: PromotionSlot[] = [],
  history: string[] = [],
  idle = 0
): Turn => {
  const pieces = lists(board)
  const position = awaken(side, { pieces, position: board })
  const { checkers, pinned } = scanPope(side, { pieces, position })
  const marshalSquare = squareOf(side, MARSHAL, position)
  const victims =
    last === null ? [] : riposteSquares(side === WHITE ? BLACK : WHITE, last.position, last.move)
  const riposte =
    marshalSquare !== null && victims.some(square => clearLine(position, marshalSquare, square))
  const key = [
    side,
    Object.keys(position)
      .toSorted()
      .map(square => {
        const piece = position[square]
        return `${square}${piece.side}${piece.piece}${piece.awake === true ? '*' : ''}`
      })
      .join(','),
    `${castling.left}${castling.right}`,
    enPassant === null ? '' : `${enPassant.behind}${enPassant.enemy}`,
    riposte
  ].join('|')
  return {
    side,
    pieces,
    position,
    castling: castling ?? { left: true, right: true },
    checkers,
    pinned,
    riposte,
    enPassant,
    promotionSlots,
    key,
    repetition: history.filter(seen => seen === key).length + 1,
    idle
  }
}