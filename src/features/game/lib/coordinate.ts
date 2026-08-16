import type { Square } from '@/types/game'
import { SIZE, FILES } from '@/constants/board'

export const parseSquare = (square: string): Square => {
  return {
    file: FILES.indexOf(square.charAt(0)),
    rank: Number(square.slice(1))
  }
}
export const makeSquare = ({ file, rank }: Square): string => {
  return `${FILES[file]}${rank}`
}
export const isOnBoard = ({ file, rank }: Square): boolean => {
  return file >= 0 && file < SIZE && rank >= 1 && rank <= SIZE
}