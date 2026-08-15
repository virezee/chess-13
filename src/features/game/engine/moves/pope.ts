import type { Side, SquareOccupant } from '@/types/material'
import type { Move, Castling, CastlingSide } from '@/types/game'
import { SENTINEL, CASTLING } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const castle = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  castling: Castling
): Move | null => {
  const sentinel = occupancy[castling.sentinel]
  if (!sentinel || sentinel.side !== side || sentinel.piece !== SENTINEL) return null
  if (castling.between.some(square => occupancy[square])) return null
  return { from, to: castling.to, sentinel: { from: castling.sentinel, to: castling.sentinelTo } }
}
export const pope = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  castlingSide: CastlingSide
): Move[] => {
  const origin = parseSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const file = origin.file + fileStep
    const rank = origin.rank + rankStep
    if (!isOnBoard(file, rank)) continue
    const to = makeSquare(file, rank)
    const occupant = occupancy[to]
    if (!occupant) {
      moves.push({ from, to })
      continue
    }
    if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
  }
  const castlings = CASTLING[side]
  if (from !== castlings.home) return moves
  for (const [avail, castling] of [
    [castlingSide.left, castlings.left],
    [castlingSide.right, castlings.right]
  ] as const) {
    if (!avail) continue
    const move = castle(side, occupancy, from, castling)
    if (move) moves.push(move)
  }
  return moves
}