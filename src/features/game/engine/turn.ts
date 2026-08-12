import type { Side, Position } from '@/types/piece'
import type { Move, Castling, EnPassant, PromotionSlot, Turn } from '@/types/move'
import { WHITE, BLACK } from '@/constants/colour'
import { MARSHAL } from '@/constants/piece'
import { fromSquare, toSquare, squareOf } from '../lib/coordinate'
import { scanPope, dormantEmperor, isAttackedLegally } from './legality'
import { riposteSquares } from './moves'

const awaken = (side: Side, position: Position): Position => {
  const square = dormantEmperor(side, position)
  if (square === null) return position
  const enemy = side === WHITE ? BLACK : WHITE
  if (squareOf(side, MARSHAL, position) !== null && !isAttackedLegally(enemy, position, square))
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
  castling: Castling = { left: true, right: true },
  enPassant: EnPassant | null = null,
  promotionSlots: PromotionSlot[] = []
): Turn => {
  const position = awaken(side, board)
  const { checkers, pinned } = scanPope(side, position)
  const marshalSquare = squareOf(side, MARSHAL, position)
  const victims =
    last === null ? [] : riposteSquares(side === WHITE ? BLACK : WHITE, last.position, last.move)
  const riposte =
    marshalSquare !== null && victims.some(square => clearLine(position, marshalSquare, square))
  return { side, position, checkers, pinned, riposte, castling, enPassant, promotionSlots }
}