import type { Side, PieceName, Piece, PieceSquares, SquareOccupant } from './material'
import type {
  CHECKMATE,
  STALEMATE,
  REPETITION,
  NO_PROGRESS,
  INSUFFICIENT_MATERIAL,
  RESIGNATION
} from '@/constants/outcome'

export interface Board {
  pieces: Record<Side, PieceSquares>
  occupancy: SquareOccupant
}
export interface Square {
  file: number
  rank: number
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
  moved?: { piece: Piece; square: string }
  vacated?: readonly string[]
}
export interface Counter {
  count: number
  limit: number
}
export interface State {
  awake: Record<Side, boolean>
  riposte: boolean
  castlingSide: Record<Side, CastlingSide>
  promotions: Record<Side, Promotion[]>
  enPassant: EnPassant | null
  noProgress: Counter
}
export interface Position extends Board {
  side: Side
  checkInfo: CheckInfo
  state: State
  enhanced: Set<string>
}
export interface Match {
  swap: boolean
  whitePlayer: string | null
  lastMove: Move | null
  history: string[]
  pgn: string
  resigned: Side | null
}
export interface Save {
  side: Side
  occupancy: SquareOccupant
  state: State
  match: Match
}
export interface Result {
  winner: Side | null
  reason:
    | typeof CHECKMATE
    | typeof STALEMATE
    | typeof REPETITION
    | typeof NO_PROGRESS
    | typeof INSUFFICIENT_MATERIAL
    | typeof RESIGNATION
}