import type { Side, PieceName, Piece, Position } from './piece'

export interface Move {
  from: string
  to: string
  captures?: string[]
  promotesTo?: PieceName
  partner?: { from: string; to: string }
}
export interface View {
  vacated?: readonly string[]
  moved?: { square: string; piece: Piece }
}
export interface Castling {
  left: boolean
  right: boolean
}
export interface EnPassant {
  behind: string
  enemy: string
}
export interface PromotionSlot {
  piece: PieceName
  file: number
}
export interface Turn {
  side: Side
  position: Position
  castling: Castling
  checkers: string[]
  pinned: Map<string, readonly [number, number]>
  riposte: boolean
  enPassant: EnPassant | null
  promotionSlots: PromotionSlot[]
}