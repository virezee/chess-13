import type { Side, PieceName, SquareOccupant } from '@/types/material'
import type { Move, Promotion, EnPassant } from '@/types/game'
import { SIZE, CENTRE } from '@/constants/board'
import { WHITE } from '@/constants/colour'
import { REACH } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../../lib/coordinate'
import { isDormant } from './emperor'

const push = (side: Side): number => (side === WHITE ? 1 : -1)
const quiets = (
  side: Side,
  occupancy: SquareOccupant,
  from: string,
  isEnhanced: boolean
): Move[] => {
  const { file, rank } = parseSquare(from)
  const up = push(side)
  const { quiet } = REACH.legionary[isEnhanced ? ENHANCED : RESTRICTED]
  const isBeforeCentre = side === WHITE ? rank < CENTRE : rank > CENTRE
  const reach = isBeforeCentre ? Math.abs(CENTRE - rank) : quiet
  const moves: Move[] = []
  for (let distance = 1; distance <= reach; distance += 1) {
    const toRank = rank + up * distance
    if (toRank < 1 || toRank > SIZE) break
    const to = makeSquare(file, toRank)
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
  const { file, rank } = parseSquare(from)
  const toRank = rank + push(side)
  const moves: Move[] = []
  for (const offset of [-1, 1]) {
    const adjFile = file + offset
    if (!isOnBoard(adjFile, toRank)) continue
    const to = makeSquare(adjFile, toRank)
    const occupant = occupancy[to]
    if (occupant) {
      if (occupant.side !== side && !isDormant(occupant)) moves.push({ from, to, captures: [to] })
      continue
    }
    if (enPassant?.target !== to) continue
    const victim = occupancy[enPassant.captured]
    if (victim && victim.side !== side) moves.push({ from, to, captures: [enPassant.captured] })
  }
  return moves
}
const promotionPieces = (side: Side, square: string, promotions: Promotion[]): PieceName[] => {
  const { file, rank } = parseSquare(square)
  const promRank = side === WHITE ? SIZE : 1
  if (rank !== promRank) return []
  return [
    ...new Set(
      promotions
        .filter(promotion => Math.abs(promotion.file - file) <= 1)
        .flatMap(promotion => promotion.piece)
    )
  ]
}
const withPromotions = (side: Side, move: Move, promotions: Promotion[]): Move[] => {
  const promPiece = promotionPieces(side, move.to, promotions)
  if (promPiece.length === 0) return [move]
  return promPiece.map(piece => {
    const promoted: Move = { from: move.from, to: move.to, promotesTo: piece }
    if (move.captures) promoted.captures = move.captures
    return promoted
  })
}
const transforms = (side: Side, from: string, promotions: Promotion[]): Move[] =>
  promotionPieces(side, from, promotions).map(piece => ({ from, to: from, promotesTo: piece }))
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