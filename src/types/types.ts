import type { WHITE, BLACK } from '@/constants/colour'

export type Side = typeof WHITE | typeof BLACK
export type PieceName =
  | 'sentinel'
  | 'templar'
  | 'herald'
  | 'mage'
  | 'assassin'
  | 'emperor'
  | 'pope'
  | 'marshal'
  | 'legionary'
export interface Piece {
  side: Side
  piece: PieceName
}
export type Position = Record<string, Piece>
export type AuraState = 'full' | 'partial' | 'none'
export interface Move {
  from: string
  to: string
  captures?: string[]
  promotesTo?: PieceName
}
export interface EnPassant {
  behind: string
  victim: string
}
export interface PromotionSlot {
  piece: PieceName
  file: number
}
export interface ArmyState {
  side: Side
  player: string
  marshalSquare: string | null
  aura: AuraState
  enhancedCount: number
  pieceCount: number
  lost: string[]
  promotionSlots: PromotionSlot[]
  material: number
}
export interface LoggedTurn {
  number: number
  white: string
  black: string | null
}
export interface GameCounters {
  repetition: number
  repetitionLimit: number
  noProgress: number
  noProgressLimit: number
}