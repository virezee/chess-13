import type { Side } from './material'
import type { Promotion, Counter } from './game'

export type EmperorState = 'dormant' | 'awake' | null
export type CommandZone = 'full' | 'partial' | 'none'
export interface ArmyState {
  player: string
  side: Side
  emperor: EmperorState
  marshalSquare: string | null
  commandZone: CommandZone
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