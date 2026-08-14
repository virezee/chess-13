import type { Side, PieceName, Piece, PieceSquares, SquareOccupant } from './material'

export interface Board {
  pieces: Record<Side, PieceSquares>
  occupancy: SquareOccupant
}
export interface CheckInfo {
  checkers: string[]
  pinned: Map<string, readonly [number, number]>
}
export interface Step {
  from: string
  to: string
}
export interface Move extends Step {
  captures?: string[]
  sentinel?: Step
  promotesTo?: PieceName
}
export interface Castling {
  to: string
  sentinel: string
  sentinelTo: string
  between: readonly string[]
}
export interface CastlingSide {
  left: boolean
  right: boolean
}
export interface Promotion {
  file: number
  piece: PieceName[]
}
export interface EnPassant {
  target: string
  captured: string
}
export interface View {
  moved?: { square: string; piece: Piece }
  vacated?: readonly string[]
}
export interface State {
  castlingSide: Record<Side, CastlingSide>
  promotions: Record<Side, Promotion[]>
  enPassant: EnPassant | null
  riposte: boolean
  noProgress: number
  noProgressLimit: number
}
export interface Position extends Board {
  side: Side
  checkInfo: CheckInfo
  state: State
}
export interface Match {
  swap: boolean
  whitePlayer: string | null
  history: string[]
}