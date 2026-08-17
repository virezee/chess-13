import type { Side } from './material'
import type { Promotion, Counter } from './game'

export type EmperorState = { square: string; awake: boolean } | null
export type MarshalState = 'full' | 'partial' | 'none'
export interface ArmyState {
  player: string
  side: Side
  pieceCount: number
  marshalSquare: string | null
  aura: MarshalState
  enhancedCount: number
  emperor: EmperorState
  lost: string[]
  promotionSlots: Promotion[]
  material: number
}
export interface LoggedTurn {
  white: string
  black: string | null
  number: number
}
export interface GameCounters {
  repetition: Counter
  noProgress: Counter
}