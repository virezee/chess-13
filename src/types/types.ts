export type Side = 'white' | 'black'
export type PieceType =
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
  type: PieceType
}
/** Occupied squares only, keyed by algebraic square such as `a1`. */
export type Position = Record<string, Piece>

/**
 * One candidate move, produced before legality has been checked.
 *
 * `captures` names the square the victim stands on instead of being a boolean,
 * because in this game that square is not always `to`. The Assassin lands behind
 * its victim, the Mage does not move at all, and en passant takes a piece the
 * capturer never steps on.
 */
export interface Move {
  from: string
  to: string
  captures?: string
}

/**
 * Where the army stands relative to its own Marshal.
 * - `command` the Marshal holds g7, so the whole army is strong
 * - `active`  pieces within Chebyshev distance 4 are strong
 * - `down`    the Marshal is captured, so the whole army is weak
 */
export type AuraState = 'command' | 'active' | 'down'

export interface PromotionSlot {
  /** Piece type that has been lost and can now be promoted into. */
  piece: string
  /** Files a Legionary must arrive on to claim it, for example "c-e". */
  files: string
}

export interface ArmyState {
  side: Side
  player: string
  /** Algebraic square, or null once the Marshal has been captured. */
  marshalSquare: string | null
  aura: AuraState
  strongCount: number
  pieceCount: number
  /** Letters of this side's own pieces that have been lost. */
  lost: string[]
  promotionSlots: PromotionSlot[]
  /** Total value of this side's pieces at their current strong or weak rating. */
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