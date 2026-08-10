import type { Side, Position } from '@/types/piece'
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
  position: Position
): string | null => {
  for (const [square, occupant] of Object.entries(position)) {
    if (occupant.side === side && occupant.piece === piece) return square
  }
  return null
}
export const onLine = (
  from: string,
  [fileStep, rankStep]: readonly [number, number],
  to: string
): boolean => {
  const origin = fromSquare(from)
  const target = fromSquare(to)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (fileStep === 0) return files === 0 && Math.sign(ranks) === rankStep
  if (rankStep === 0) return ranks === 0 && Math.sign(files) === fileStep
  return (
    Math.abs(files) === Math.abs(ranks) &&
    Math.sign(files) === fileStep &&
    Math.sign(ranks) === rankStep
  )
}
export const blocks = (pope: string, checker: string, square: string): boolean => {
  const origin = fromSquare(pope)
  const target = fromSquare(checker)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  const at = fromSquare(square)
  for (let step = 1; step < distance; step += 1) {
    if (at.file === origin.file + fileStep * step && at.rank === origin.rank + rankStep * step)
      return true
  }
  return false
}