import type { PieceName } from './piece'

export interface Move {
  from: string
  to: string
  captures?: string[]
  promotesTo?: PieceName
}
export interface EnPassant {
  behind: string
  enemy: string
}
export interface PromotionSlot {
  piece: PieceName
  file: number
}