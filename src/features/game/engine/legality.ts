import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { POPE } from '@/constants/piece'
import { squareOf } from '@/features/game/board'
import { apply } from './apply'

const survives = (side: Side, position: Position, move: Move): boolean => {
  const after = apply(position, move)
  const pope = squareOf(side, POPE, after)
  if (pope === null) return false
  return !attacks(opponent(side), after, riposteSquares(side, position, move)).has(pope)
}
export const legal = (side: Side, position: Position, riposte: string[] = []): Move[] =>
  pseudoLegal(side, position, riposte).filter(move => survives(side, position, move))
export const isCheck = (side: Side, position: Position, riposte: string[] = []): boolean => {
  const pope = squareOf(side, POPE, position)
  if (pope === null) return false
  return attacks(opponent(side), position, riposte).has(pope)
}