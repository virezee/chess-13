import type { Side, Position } from '@/types/piece'
import type { Castling, EnPassant, PromotionSlot, Turn } from '@/types/move'
import { MARSHAL } from '@/constants/piece'
import { fromSquare, toSquare, squareOf } from '../lib/coordinate'
import { scanPope } from './legality'

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
  position: Position,
  victims: readonly string[] = [],
  castling: Castling = { left: true, right: true },
  enPassant: EnPassant | null = null,
  promotionSlots: PromotionSlot[] = []
): Turn => {
  const { checkers, pinned } = scanPope(side, position)
  const marshalSquare = squareOf(side, MARSHAL, position)
  const riposte =
    marshalSquare !== null && victims.some(square => clearLine(position, marshalSquare, square))
  return { side, position, checkers, pinned, riposte, castling, enPassant, promotionSlots }
}