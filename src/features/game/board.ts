import { SIZE, FILES } from '@/constants/board'

export function toSquare(file: number, rank: number): string {
  return `${FILES[file]}${rank}`
}
export function fromSquare(square: string): { file: number; rank: number } {
  return {
    file: FILES.indexOf(square[0]),
    rank: Number(square.slice(1))
  }
}
export function isOnBoard(file: number, rank: number): boolean {
  return file >= 0 && file < SIZE && rank >= 1 && rank <= SIZE
}