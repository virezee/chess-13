import type { SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { SIZE, FILES, RANKS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, SENTINEL, TEMPLAR, HERALD, LEGIONARY } from '@/constants/piece'
import { assassin, sentinel, mage, herald, templar, legionary } from '@/features/game/engine/moves'

const capturedSquares = (move: Move): string[] =>
  move.to === move.from ? (move.captures ?? []) : [move.to]
const split = (moves: Move[]): { moves: string[]; captures: string[] } => ({
  moves: moves.filter(move => !move.captures).map(move => move.to),
  captures: moves.filter(move => move.captures).flatMap(move => capturedSquares(move))
})
const alongFile = (count: number): string[] => RANKS.slice(1, count + 1).map(rank => `a${rank}`)
const alongRank = (count: number): string[] => FILES.slice(1, count + 1).map(file => `${file}1`)
export const squares = (
  mover: (enemy: SquareOccupant) => Move[]
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
export const heraldReach = (isEnhanced: boolean): string[] =>
  herald(WHITE, {}, 'c3', isEnhanced).map(move => move.to)
export const heraldDiagonals = (isEnhanced: boolean): string[] =>
  heraldReach(isEnhanced).filter(square => !new Set(['b3', 'c2', 'c4', 'd3']).has(square))
export const sentinelReach = (isEnhanced: boolean): string[] =>
  sentinel(
    WHITE,
    isEnhanced ? { d1: { side: WHITE, piece: MARSHAL } } : {},
    'a1',
    'd1',
    isEnhanced
  ).map(move => move.to)
export const sentinelCapture = (isEnhanced: boolean): string[] =>
  isEnhanced ? [...alongFile(SIZE - 1), ...alongRank(2)] : [...alongFile(6), ...alongRank(6)]
export const templarLeap = (isEnhanced: boolean): string[] =>
  templar(WHITE, {}, 'g7', isEnhanced).map(move => move.to)
export const legionaryAdvance = (isEnhanced: boolean): string[] =>
  legionary(WHITE, {}, 'e3', isEnhanced, [], null).map(move => move.to)
export const legionaryPush = (isEnhanced: boolean): string[] =>
  legionary(WHITE, {}, 'e8', isEnhanced, [], null).map(move => move.to)
export const mageReach = (isEnhanced: boolean): string[] =>
  mage(WHITE, isEnhanced ? { g7: { side: WHITE, piece: MARSHAL } } : {}, 'f7', isEnhanced).map(
    move => move.to
  )
export const mageBlast = (isEnhanced: boolean): string[] =>
  isEnhanced ? ['e7', 'e8', 'f6', 'g6'] : ['e7', 'e8', 'f6', 'f8', 'g6', 'g8']
export const assassinReach = (isEnhanced: boolean): string[] =>
  assassin(WHITE, isEnhanced ? { e4: { side: WHITE, piece: MARSHAL } } : {}, 'c3', isEnhanced).map(
    move => move.to
  )
export const assassinMoves = (isEnhanced: boolean, isCapture: boolean): string[] =>
  assassin(
    WHITE,
    {
      c7: { side: BLACK, piece: SENTINEL },
      i9: { side: BLACK, piece: TEMPLAR },
      m3: { side: BLACK, piece: HERALD }
    },
    'c3',
    isEnhanced
  )
    .filter(move => Boolean(move.captures) === isCapture)
    .map(move => move.to)