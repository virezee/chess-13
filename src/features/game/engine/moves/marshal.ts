import type { Side, Position } from '@/types/piece'
import type { Move } from '@/types/move'
import { SIZE } from '@/constants/board'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard } from '@/features/game/board'

export function onMarshalLine(position: Position, from: string, to: string): boolean {
  if (from === to) return false
  const origin = fromSquare(from)
  const target = fromSquare(to)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  for (let step = 1; step < distance; step += 1) {
    if (position[toSquare(origin.file + fileStep * step, origin.rank + rankStep * step)])
      return false
  }
  return true
}
export const marshal = (side: Side, position: Position, from: string): Move[] => {
  const origin = fromSquare(from)
  const moves: Move[] = []
  for (const [fileStep, rankStep] of EVERY) {
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const to = toSquare(file, rank)
      const occupant = position[to]
      if (!occupant) {
        moves.push({ from, to })
        continue
      }
      if (occupant.side !== side) moves.push({ from, to, captures: [to] })
      break
    }
  }
  return moves
}