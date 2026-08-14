import type { Side, PieceName, SquareOccupant } from '@/types/material'
import type { Move, Promotion, EnPassant } from '@/types/game'
import { SIZE, CENTRE } from '@/constants/board'
import { WHITE } from '@/constants/colour'
import { REACH } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { fromSquare, toSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const step = (side: Side): number => (side === WHITE ? 1 : -1)
const quiets = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const { file, rank } = fromSquare(from)
  const forward = step(side)
  const { quiet } = REACH.legionary[isEnhanced ? ENHANCED : RESTRICTED]
  const beforeCentre = side === WHITE ? rank < CENTRE : rank > CENTRE
  const reach = beforeCentre ? Math.abs(CENTRE - rank) : quiet
  const moves: Move[] = []
  for (let squares = 1; squares <= reach; squares += 1) {
    const rankAhead = rank + forward * squares
    if (rankAhead < 1 || rankAhead > SIZE) break
    const to = toSquare(file, rankAhead)
    if (occupancy[to]) break
    moves.push({ from, to })
  }
  return moves
}
const captures = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  enPassant: EnPassant | null
): Move[] => {
  const { file, rank } = fromSquare(from)
  const rankAhead = rank + step(side)
  const moves: Move[] = []
  for (const offset of [-1, 1]) {
    const fileBeside = file + offset
    if (!isOnBoard(fileBeside, rankAhead)) continue
    const to = toSquare(fileBeside, rankAhead)
    const occupant = occupancy[to]
    if (occupant) {
      if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
      continue
    }
    if (enPassant?.target !== to) continue
    const passer = occupancy[enPassant.captured]
    if (passer && passer.side !== side) moves.push({ from, to, captures: [enPassant.captured] })
  }
  return moves
}
const claimables = (side: Side, square: string, promotions: Promotion[]): PieceName[] => {
  const { file, rank } = fromSquare(square)
  const lastRank = side === WHITE ? SIZE : 1
  if (rank !== lastRank) return []
  return [
    ...new Set(
      promotions
        .filter(promotion => Math.abs(promotion.file - file) <= 1)
        .flatMap(promotion => promotion.piece)
    )
  ]
}
const withPromotions = (side: Side, move: Move, promotions: Promotion[]): Move[] => {
  const claimable = claimables(side, move.to, promotions)
  if (claimable.length === 0) return [move]
  return claimable.map(piece => {
    const promoted: Move = { from: move.from, to: move.to, promotesTo: piece }
    if (move.captures) promoted.captures = move.captures
    return promoted
  })
}
const transforms = (side: Side, from: string, promotions: Promotion[]): Move[] =>
  claimables(side, from, promotions).map(piece => ({ from, to: from, promotesTo: piece }))
export const legionary = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean,
  promotions: Promotion[],
  enPassant: EnPassant | null
): Move[] => {
  return [
    ...[
      ...quiets(side, occupancy, from, isEnhanced),
      ...captures(side, occupancy, from, enPassant)
    ].flatMap(move => withPromotions(side, move, promotions)),
    ...transforms(side, from, promotions)
  ]
}