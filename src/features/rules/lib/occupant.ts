import type { Side, PieceName } from '@/types/material'
import type { BoardPiece } from '../types/setup'

export const place = (
  side: Side,
  piece: PieceName,
  square: string,
  isEnhanced: boolean
): BoardPiece => ({ side, piece, square, isEnhanced })