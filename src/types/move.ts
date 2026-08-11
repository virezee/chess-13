import type { Side, PieceName, Piece, Position } from './piece'

export interface Move {
  from: string
  to: string
  captures?: string[]
  sentinel?: { from: string; to: string }
  promotesTo?: PieceName
}
export interface View {
  vacated?: readonly string[]
  moved?: { square: string; piece: Piece }
}
export interface Castling {
  left: boolean
  right: boolean
}
export interface Wing {
  to: string
  sentinel: string
  lands: string
  between: readonly string[]
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