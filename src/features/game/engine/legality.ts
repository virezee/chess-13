import type { Side, Position } from '@/types/piece'
import type { Move, View, Turn } from '@/types/move'
import { SIZE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, ASSASSIN } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard, squareOf } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { occupantAt, reaches, assassinReaches, threats } from './threats'
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
const isAttacked = (turn: Turn, square: string, move: Move): boolean =>
  threats(opponent(turn.side), turn.position, square, after(turn.position, move)).length > 0
const isDefended = (turn: Turn, square: string): boolean =>
  threats(turn.side, turn.position, square).length > 0
const losesPope = (turn: Turn, square: string | null, pope: string | null, move: Move): boolean => {
  if (square === null || pope === null) return false
  const view = after(turn.position, move)
  if (threats(turn.side, turn.position, square, view).length === 0) return false
  const origin = fromSquare(square)
  const target = fromSquare(pope)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  for (let step = 1; step < distance; step += 1) {
    const between = toSquare(origin.file + fileStep * step, origin.rank + rankStep * step)
    if (occupantAt(turn.position, view, between)) return false
  }
  return true
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
            ? assassinReaches(position, view, shield ?? pope!, fileStep, rankStep, gap, enhanced)
            : reaches(occupant, isDiagonal, rankStep, gap, enhanced)
      if (hits) {
        if (shield === null) checkers.push(at)
        else pinned.set(shield, [fileStep, rankStep])
      }
      break
    }
  }
  for (const from of threats(enemy, position, pope!, view)) {
    if (!checkers.includes(from)) checkers.push(from)
  }
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
  const found = threats(by, position, square, view)
  if (found.length === 0) return false
  const pope = squareOf(by, POPE, position)
  const { pinned } = scanPope(by, position, view)
  return found.some(from => {
    const pin = pinned.get(from)
    return !pin || pope === null || onLine(pin, pope, square)
  })
}
export const legality = (turn: Turn): Move[] => {
  const pope = squareOf(turn.side, POPE, turn.position)
  const dormant = dormantEmperor(opponent(turn.side), turn.position)
  return candidate(turn).filter(move => {
    const mover = turn.position[move.from]
    if (!mover) return false
    if (losesPope(turn, dormant, mover.piece === POPE ? move.to : pope, move)) return false
    if (mover.piece === POPE) {
      if (!move.sentinel) return !isAttacked(turn, move.to, move)
      if (turn.checkers.length > 0) return false
      const enemy = opponent(turn.side)
      return path(move.from, move.to).every(
        square => threats(enemy, turn.position, square).length === 0
      )
    }
    const empties = move.captures?.some(square => square !== move.to) ?? false
    if (pope !== null && (turn.checkers.length > 0 || empties) && isAttacked(turn, pope, move))
      return false
    if (mover.piece === MARSHAL && move.captures && !turn.riposte) {
      const victim = turn.position[move.to]
      if (victim?.piece !== POPE && !isDefended(turn, move.to)) return false
    }
    if (
      mover.piece === ASSASSIN &&
      move.captures &&
      isAttackedLegally(opponent(turn.side), turn.position, move.to, after(turn.position, move))
    )
      return false
    return true
  })
}