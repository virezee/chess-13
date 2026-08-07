import type { Side } from './piece'
import type { PromotionSlot } from './move'

export type AuraState = 'full' | 'partial' | 'none'
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