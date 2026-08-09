import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, MARSHAL, ASSASSIN } from '@/constants/piece'
import { squareOf } from '@/features/game/board'
import { apply } from './apply'
import { generate } from './generate'
import { onMarshalLine, marshal } from './moves'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
const riposteSquares = (side: Side, position: Position, move: Move): string[] =>
  (move.captures ?? []).filter(square => position[square].side !== side)
const isEnPrise = (side: Side, position: Position, move: Move): boolean =>
  attacks(opponent(side), apply(position, move), riposteSquares(side, position, move)).has(move.to)
export const pseudoLegal = (side: Side, position: Position, riposte: string[] = []): Move[] => {
  const marshalSquare = squareOf(side, MARSHAL, position)
  const moves: Move[] = []
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side !== side || piece.piece === MARSHAL) continue
    for (const move of generate(side, piece.piece, position, marshalSquare, square)) {
      if (piece.piece === ASSASSIN && move.captures && isEnPrise(side, position, move)) continue
      moves.push(move)
    }
  }
  if (marshalSquare === null) return moves
  const attacked = new Set(moves.flatMap(move => move.captures ?? []))
  const free = riposte.some(square => onMarshalLine(position, marshalSquare, square))
  for (const move of marshal(side, position, marshalSquare)) {
    if (!move.captures) {
      moves.push(move)
      continue
    }
    if (free || position[move.to].piece === POPE || attacked.has(move.to)) moves.push(move)
  }
  return moves
}
export const attacks = (side: Side, position: Position, riposte: string[] = []): Set<string> => {
  const attacked = new Set<string>()
  for (const move of pseudoLegal(side, position, riposte)) {
    for (const target of move.captures ?? []) attacked.add(target)
  }
  return attacked
}