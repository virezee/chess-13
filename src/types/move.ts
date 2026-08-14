import type { Side, PieceName, Piece, PieceList, Position } from './piece'

export interface Move {
  from: string
  to: string
  captures?: string[]
  sentinel?: { from: string; to: string }
  promotesTo?: PromotionSlot
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
  sentinelTo: string
  between: readonly string[]
}
export interface EnPassant {
  behind: string
  enemy: string
}
export interface Rights {
  swap: boolean
  whitePlayer: string | null
  castling: Record<Side, Castling>
  enPassant: EnPassant | null
  riposte: boolean
}
export interface PromotionSlot {
  piece: PieceName
  file: number
}
export interface Board {
  pieces: Record<Side, PieceList>
  position: Position
}
export interface Turn extends Board {
  side: Side
  rights: Rights
  promotionSlots: Record<Side, PromotionSlot[]>
  checkers: string[]
  pinned: Map<string, readonly [number, number]>
  history: string[]
  noProgress: number
  noProgressLimit: number
}