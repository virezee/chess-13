import type { Side, PieceName, Position, Move, EnPassant, PromotionSlot } from '@/types/types'
import { SIZE, CENTRE } from '@/constants/board'
import { WHITE } from '@/constants/colour'
import { toSquare, fromSquare, isOnBoard } from '@/features/game/board'

const step = (side: Side): number => (side === WHITE ? 1 : -1)
const beforeCentre = (side: Side, rank: number): boolean =>
  side === WHITE ? rank < CENTRE : rank > CENTRE
const lastRank = (side: Side): number => (side === WHITE ? SIZE : 1)
const quiets = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => {
  const { file, rank } = fromSquare(from)
  const forward = step(side)
  const stride = isEnhanced ? 2 : 1
  const reach = beforeCentre(side, rank) ? Math.abs(CENTRE - rank) : stride
  const moves: Move[] = []
  for (let squares = 1; squares <= reach; squares += 1) {
    const rankAhead = rank + forward * squares
    if (rankAhead < 1 || rankAhead > SIZE) break
    const to = toSquare(file, rankAhead)
    if (position[to]) break
    moves.push({ from, to })
  }
  return moves
}
const captures = (
  side: Side,
  position: Position,
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
    const occupant = position[to]
    if (occupant) {
      if (occupant.side !== side) moves.push({ from, to, captures: [to] })
      continue
    }
    if (enPassant?.behind !== to) continue
    const passer = position[enPassant.victim]
    if (passer && passer.side !== side) moves.push({ from, to, captures: [enPassant.victim] })
  }
  return moves
}
const claimables = (side: Side, square: string, slots: PromotionSlot[]): PieceName[] => {
  const { file, rank } = fromSquare(square)
  if (rank !== lastRank(side)) return []
  return [...new Set(slots.filter(slot => Math.abs(slot.file - file) <= 1).map(slot => slot.piece))]
}
const withPromotions = (side: Side, move: Move, slots: PromotionSlot[]): Move[] => {
  const claimable = claimables(side, move.to, slots)
  if (claimable.length === 0) return [move]
  return claimable.map(piece => {
    const promoted: Move = { from: move.from, to: move.to, promotesTo: piece }
    if (move.captures) promoted.captures = move.captures
    return promoted
  })
}
const transforms = (side: Side, from: string, slots: PromotionSlot[]): Move[] =>
  claimables(side, from, slots).map(piece => ({ from, to: from, promotesTo: piece }))
export const legionary = (
  side: Side,
  position: Position,
  from: string,
  isEnhanced: boolean,
  enPassant: EnPassant | null,
  slots: PromotionSlot[]
): Move[] => {
  return [
    ...[
      ...quiets(side, position, from, isEnhanced),
      ...captures(side, position, from, enPassant)
    ].flatMap(move => withPromotions(side, move, slots)),
    ...transforms(side, from, slots)
  ]
}