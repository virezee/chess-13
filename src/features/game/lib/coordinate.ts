import type { Side, SquareOccupant } from '@/types/material'
import { SIZE, FILES } from '@/constants/board'
import { POPE, MARSHAL } from '@/constants/piece'

export const fromSquare = (square: string): { file: number; rank: number } => {
  return {
    file: FILES.indexOf(square[0]),
    rank: Number(square.slice(1))
  }
}
export const toSquare = (file: number, rank: number): string => {
  return `${FILES[file]}${rank}`
}
export const isOnBoard = (file: number, rank: number): boolean => {
  return file >= 0 && file < SIZE && rank >= 1 && rank <= SIZE
}
export const squareOf = (
  side: Side,
  piece: typeof POPE | typeof MARSHAL,
  occupancy: SquareOccupant
): string | null => {
  for (const [square, occupant] of Object.entries(occupancy)) {
    if (occupant.side === side && occupant.piece === piece) return square
  }
  return null
}