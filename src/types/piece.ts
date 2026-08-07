import type { WHITE, BLACK } from '@/constants/colour'

export type Side = typeof WHITE | typeof BLACK
export type PieceName =
  | 'pope'
  | 'emperor'
  | 'marshal'
  | 'assassin'
  | 'sentinel'
  | 'mage'
  | 'herald'
  | 'templar'
  | 'legionary'
export interface Piece {
  side: Side
  piece: PieceName
}
export type Position = Record<string, Piece>