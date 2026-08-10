import type { Side, Position } from '@/types/piece'
import type { Move, Castling } from '@/types/move'
import { SIZE } from '@/constants/board'
import { WHITE } from '@/constants/colour'
import { SENTINEL } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/lib/coordinate'
import { isDormant } from './emperor'

const HOME_FILE = 6
const LEFT = { pope: 3, sentinel: 0, lands: 4, between: [1, 2, 3, 4, 5] }
const RIGHT = { pope: 9, sentinel: 12, lands: 8, between: [7, 8, 9, 10, 11] }

const castle = (
  side: Side,
  position: Position,
  from: string,
  wing: typeof LEFT
): Move | null => {
  const rank = side === WHITE ? 1 : SIZE
  if (from !== toSquare(HOME_FILE, rank)) return null
  const corner = toSquare(wing.sentinel, rank)
  const sentinel = position[corner]
  if (!sentinel || sentinel.side !== side || sentinel.piece !== SENTINEL) return null
  if (wing.between.some(file => position[toSquare(file, rank)])) return null
  return {
    from,
    to: toSquare(wing.pope, rank),
    partner: { from: corner, to: toSquare(wing.lands, rank) }
  }
}
export const pope = (
  side: Side,
  position: Position,
  from: string,
  castling: Castling = { left: false, right: false }
): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = toSquare(file, rank)
    const occupant = position[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
  }
  for (const [available, wing] of [
    [castling.left, LEFT],
    [castling.right, RIGHT]
  ] as const) {
    if (!available) continue
    const move = castle(side, position, from, wing)
    if (move) moves.push(move)
  }
  return moves
}
