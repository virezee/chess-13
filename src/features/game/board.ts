import type { Side, Position } from '@/types/piece'
import { SIZE, FILES } from '@/constants/board'
import { POPE, MARSHAL } from '@/constants/piece'

export function fromSquare(square: string): { file: number; rank: number } {
  return {
    file: FILES.indexOf(square[0]),
    rank: Number(square.slice(1))
  }
}
export function toSquare(file: number, rank: number): string {
  return `${FILES[file]}${rank}`
}
export function isOnBoard(file: number, rank: number): boolean {
  return file >= 0 && file < SIZE && rank >= 1 && rank <= SIZE
}
export function squareOf(
  side: Side,
  piece: typeof POPE | typeof MARSHAL,
  position: Position
): string | null {
  for (const [square, occupant] of Object.entries(position)) {
    if (occupant.side === side && occupant.piece === piece) return square
  }
  return null
}