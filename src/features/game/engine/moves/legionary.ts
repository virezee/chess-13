import { SIZE, CENTRE } from '@/constants/board'
import type { Side, Position, Move } from '@/types/types'
import { toSquare, fromSquare, isOnBoard } from '../../board'
import { WHITE } from '@/constants/colour'

const step = (side: Side): number => (side === WHITE ? 1 : -1)
const beforeCentre = (side: Side, rank: number): boolean =>
  side === 'white' ? rank < CENTRE : rank > CENTRE
const advances = (side: Side, position: Position, from: string, isEnhanced: boolean): Move[] => {
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
const captures = (position: Position, from: string, side: Side): Move[] => {
  const { file, rank } = fromSquare(from)
  const rankAhead = rank + step(side)
  const moves: Move[] = []
  for (const offset of [-1, 1]) {
    const fileBeside = file + offset
    if (!isOnBoard(fileBeside, rankAhead)) continue
    const to = toSquare(fileBeside, rankAhead)
    const victim = position[to]
    if (victim && victim.side !== side) moves.push({ from, to, captures: [to] })
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
  isEnhanced: boolean
): Move[] {
  return [...advances(side, position, from, isEnhanced), ...captures(position, from, side)]
}