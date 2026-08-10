import type { Side } from './piece'
import type { PromotionSlot } from './move'

export type AuraState = 'full' | 'partial' | 'none'
export type EmperorState = { square: string; awake: boolean } | null
export interface ArmyState {
  player: string
  side: Side
  pieceCount: number
  marshalSquare: string | null
  aura: AuraState
  enhancedCount: number
  emperor: EmperorState
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