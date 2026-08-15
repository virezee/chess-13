import { SIZE, FILES } from '@/constants/board'

export const parseSquare = (square: string): { file: number; rank: number } => {
  return {
    file: FILES.indexOf(square.charAt(0)),
    rank: Number(square.slice(1))
  }
}
export const makeSquare = (file: number, rank: number): string => {
  return `${FILES[file]}${rank}`
}
export const isOnBoard = (file: number, rank: number): boolean => {
  return file >= 0 && file < SIZE && rank >= 1 && rank <= SIZE
}