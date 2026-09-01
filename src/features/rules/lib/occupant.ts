import type { Side, PieceName, SquareOccupant } from '@/types/material'
import type { BoardPiece } from '../types/setup'

export const place = (
  side: Side,
  piece: PieceName,
  square: string,
  isEnhanced: boolean
): BoardPiece => ({ side, piece, square, isEnhanced })
export const pieceKey = (pieces: BoardPiece[], occupant: BoardPiece, index: number): string =>
  `${occupant.side}${occupant.piece}${
    pieces
      .slice(0, index)
      .filter(earlier => earlier.side === occupant.side && earlier.piece === occupant.piece).length
  }`
export const occupy = (occupants: BoardPiece[]): SquareOccupant =>
  Object.fromEntries(occupants.map(({ square, side, piece }) => [square, { side, piece }]))