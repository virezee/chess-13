import type { Side, Position } from '@/types/piece'
import type { Castling, EnPassant, PromotionSlot, Turn } from '@/types/move'
import { MARSHAL } from '@/constants/piece'
import { squareOf } from '@/features/game/lib/coordinate'
import { scanPope } from './attackers'
import { onMarshalLine } from './moves'

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
    marshalSquare !== null && victims.some(square => onMarshalLine(position, marshalSquare, square))
  return { side, position, checkers, pinned, riposte, castling, enPassant, promotionSlots }
}