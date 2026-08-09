import type { WHITE, BLACK } from '@/constants/colour'
import {
  POPE,
  EMPEROR,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY
} from '@/constants/piece'

export type Side = typeof WHITE | typeof BLACK
export type PieceName =
  | typeof POPE
  | typeof EMPEROR
  | typeof MARSHAL
  | typeof ASSASSIN
  | typeof SENTINEL
  | typeof MAGE
  | typeof HERALD
  | typeof TEMPLAR
  | typeof LEGIONARY
export interface Piece {
  side: Side
  piece: PieceName
}
export type Position = Record<string, Piece>