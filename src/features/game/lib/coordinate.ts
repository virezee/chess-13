import type { Square } from '@/types/game'
import { SIZE, FILES } from '@/constants/board'
import { LEAP } from '@/constants/piece'

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
export const isLeapOffset = (fileSpan: number, rankSpan: number): boolean =>
  LEAP.templar.enhanced.some(
    ([file, rank]) => Math.abs(file) === fileSpan && Math.abs(rank) === rankSpan
  )