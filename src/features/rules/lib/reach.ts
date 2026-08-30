import type { SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { FILES, RANKS } from '@/constants/board'
import { BLACK } from '@/constants/player'
import { LEGIONARY } from '@/constants/piece'

const capturedSquares = (move: Move): string[] =>
  move.to === move.from ? (move.captures ?? []) : [move.to]
const split = (moves: Move[]): { moves: string[]; captures: string[] } => ({
  moves: moves.filter(move => !move.captures).map(move => move.to),
  captures: moves.filter(move => move.captures).flatMap(move => capturedSquares(move))
})
export const squares = (
  mover: (occupancy: SquareOccupant) => Move[]
): { moves: string[]; captures: string[] } => {
  const standing = split(mover({}))
  if (standing.captures.length > 0) return standing
  return {
    moves: standing.moves,
    captures: FILES.flatMap(file => RANKS.map(rank => `${file}${rank}`)).filter(square =>
      mover({ [square]: { side: BLACK, piece: LEGIONARY } }).some(move =>
        capturedSquares(move).includes(square)
      )
    )
  }
}