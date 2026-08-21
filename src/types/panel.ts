import type { Side } from './material'
import type { Promotion, Counter } from './game'

export interface ArmyState {
  player: string
  side: Side
  emperor: 'dormant' | 'awake' | null
  marshalSquare: string | null
  commandZone: 'full' | 'partial' | 'none'
  pieceCount: number
  enhancedCount: number
  captured: { id: string; letter: string }[]
  promotions: Promotion[]
  material: number
}
export interface FullMove {
  white: string
  black: string | null
  number: number
}
export interface GameCounters {
  repetition: Counter
  noProgress: Counter
}