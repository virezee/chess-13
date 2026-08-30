import type { Side, PieceName, SquareOccupant } from '@/types/material'
import type { BoardPiece } from '../types/setup'

export const place = (
  side: Side,
  piece: PieceName,
  square: string,
  isEnhanced: boolean
): BoardPiece => ({ side, piece, square, isEnhanced })
export const occupy = (figures: BoardPiece[]): SquareOccupant =>
  Object.fromEntries(figures.map(({ square, side, piece }) => [square, { side, piece }]))