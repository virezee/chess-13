import { SIZE, CENTRE } from '@/constants/board'
import type { Move, Position, Side } from '@/types/types'
import { fromSquare, isOnBoard, toSquare } from '../../board'

const step = (side: Side): number => (side === 'white' ? 1 : -1)
const beforeCentre = (rank: number, side: Side): boolean =>
  side === 'white' ? rank < CENTRE : rank > CENTRE

/**
 * Straight advances. These never capture, so an occupied tile ends the run rather
 * than becoming a target, and the Legionary simply stops short and keeps the right
 * to advance again later.
 */
const advances = (position: Position, from: string, side: Side, isStrong: boolean): Move[] => {
  const { file, rank } = fromSquare(from)
  const forward = step(side)
  const stride = isStrong ? 2 : 1
  const reach = beforeCentre(rank, side) ? Math.abs(CENTRE - rank) : stride
  const moves: Move[] = []
  for (let tiles = 1; tiles <= reach; tiles += 1) {
    const rankAhead = rank + forward * tiles
    if (rankAhead < 1 || rankAhead > SIZE) break
    const to = toSquare(file, rankAhead)
    if (position[to]) break
    moves.push({ from, to })
  }
  return moves
}
/** One tile diagonally forward, on either side, and only onto an enemy piece. */
const captures = (position: Position, from: string, side: Side): Move[] => {
  const { file, rank } = fromSquare(from)
  const rankAhead = rank + step(side)
  const moves: Move[] = []
  for (const offset of [-1, 1]) {
    const fileBeside = file + offset
    if (!isOnBoard(fileBeside, rankAhead)) continue
    const to = toSquare(fileBeside, rankAhead)
    const victim = position[to]
    if (victim && victim.side !== side) moves.push({ from, to, captures: to })
  }
  return moves
}

/**
 * Every move a Legionary can make from `from`, before legality is judged.
 *
 * Two rules are deliberately absent. En passant needs to know which square an
 * enemy Legionary landed on last turn, which `position` alone cannot say, so it
 * waits until that field exists. Promotion is not a move at all here, it costs a
 * turn of its own, so a Legionary on the far rank correctly has nothing to do.
 */
export function legionaryMoves(
  position: Position,
  from: string,
  side: Side,
  isStrong: boolean
): Move[] {
  return [...advances(position, from, side, isStrong), ...captures(position, from, side)]
}