import type { Side, Position } from '@/types/piece'
import type { Move, View, Turn } from '@/types/move'
import { SIZE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, ASSASSIN } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard, squareOf } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { occupantAt, reaches, assassinReaches, leapers, threats } from './threats'
import { onLine, candidate } from './candidate'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
const after = (position: Position, move: Move): View => {
  const mover = position[move.from]
  const vacated = [move.from, ...(move.captures ?? [])]
  const dies = move.captures?.includes(move.from) ?? false
  if (!mover || dies) return { vacated }
  return { vacated, moved: { square: move.to, piece: mover } }
}
const path = (from: string, to: string): string[] => {
  const origin = fromSquare(from)
  const target = fromSquare(to)
  const step = Math.sign(target.file - origin.file)
  const squares: string[] = []
  for (let file = origin.file + step; file !== target.file + step; file += step)
    squares.push(toSquare(file, origin.rank))
  return squares
}
export const scanPope = (
  side: Side,
  position: Position,
  view: View = {}
): { checkers: string[]; pinned: Map<string, readonly [number, number]> } => {
  const checkers: string[] = []
  const pinned = new Map<string, readonly [number, number]>()
  const pope = squareOf(side, POPE, position)
  const enemy = opponent(side)
  const enemyMarshal = squareOf(enemy, MARSHAL, position)
  const origin = fromSquare(pope!)
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    let shield: string | null = null
    let shieldAt = 0
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = origin.file + fileStep * distance
      const rank = origin.rank + rankStep * distance
      if (!isOnBoard(file, rank)) break
      const at = toSquare(file, rank)
      const occupant = occupantAt(position, view, at)
      if (!occupant) continue
      if (occupant.side === side) {
        if (shield !== null) break
        shield = at
        shieldAt = distance
        continue
      }
      const gap = distance - shieldAt
      const enhanced = isEnhanced(enemyMarshal, at)
      const hits =
        occupant.piece === MARSHAL
          ? shield === null
          : occupant.piece === ASSASSIN
            ? assassinReaches(position, view, shield ?? pope!, fileStep, rankStep, enhanced, gap)
            : reaches(occupant, false, isDiagonal, rankStep, enhanced, gap)
      if (hits) {
        if (shield === null) checkers.push(at)
        else pinned.set(shield, [fileStep, rankStep])
      }
      break
    }
  }
  checkers.push(...leapers(enemy, position, enemyMarshal, pope!, view))
  return { checkers, pinned }
}
export const dormantEmperor = (side: Side, position: Position): string | null => {
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side === side && piece.piece === EMPEROR && piece.awake !== true) return square
  }
  return null
}
export const isAttackedLegally = (
  by: Side,
  position: Position,
  square: string,
  view: View = {}
): boolean => {
  const found = threats(by, position, square, false, view)
  if (found.length === 0) return false
  const pope = squareOf(by, POPE, position)
  const { pinned } = scanPope(by, position, view)
  return found.some(from => {
    const pin = pinned.get(from)
    return !pin || pope === null || onLine(pope, square, pin)
  })
}
export const legality = (turn: Turn): Move[] => {
  const enemy = opponent(turn.side)
  const pope = squareOf(turn.side, POPE, turn.position)
  const dormant = dormantEmperor(enemy, turn.position)
  return candidate(turn).filter(move => {
    const mover = turn.position[move.from]
    if (!mover) return false
    const view = after(turn.position, move)
    const guarded = mover.piece === POPE ? move.to : pope
    if (
      dormant !== null &&
      guarded !== null &&
      threats(turn.side, turn.position, dormant, false, view).length > 0 &&
      threats(enemy, turn.position, guarded, true, view).includes(dormant)
    )
      return false
    if (mover.piece === POPE) {
      if (!move.sentinel) return threats(enemy, turn.position, move.to, false, view).length === 0
      if (turn.checkers.length > 0) return false
      return path(move.from, move.to).every(
        square => threats(enemy, turn.position, square, false).length === 0
      )
    }
    const empties = move.captures?.some(square => square !== move.to) ?? false
    if (
      pope !== null &&
      (turn.checkers.length > 0 || empties) &&
      threats(enemy, turn.position, pope, false, view).length > 0
    )
      return false
    if (mover.piece === MARSHAL && move.captures && !turn.riposte) {
      const victim = turn.position[move.to]
      if (victim?.piece !== POPE && threats(turn.side, turn.position, move.to, false).length === 0)
        return false
    }
    if (
      mover.piece === ASSASSIN &&
      move.captures &&
      isAttackedLegally(opponent(turn.side), turn.position, move.to, view)
    )
      return false
    return true
  })
}