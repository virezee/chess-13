import type { Side, Position } from '@/types/piece'
import type { Move, View, Turn } from '@/types/move'
import { SIZE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, MARSHAL, ASSASSIN } from '@/constants/piece'
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
const isAttacked = (turn: Turn, square: string, move: Move): boolean =>
  threats(opponent(turn.side), turn.position, square, after(turn.position, move)).length > 0
const isDefended = (turn: Turn, square: string): boolean =>
  threats(turn.side, turn.position, square).length > 0
const isAttackedLegally = (turn: Turn, square: string, move: Move): boolean => {
  const view = after(turn.position, move)
  const enemy = opponent(turn.side)
  const found = threats(enemy, turn.position, square, view)
  if (found.length === 0) return false
  const enemyPope = squareOf(enemy, POPE, turn.position)
  const { pinned } = scanPope(enemy, turn.position, view)
  return found.some(from => {
    const pin = pinned.get(from)
    return !pin || enemyPope === null || onLine(pin, enemyPope, square)
  })
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
export const legality = (turn: Turn): Move[] => {
  const pope = squareOf(turn.side, POPE, turn.position)
  return candidate(turn).filter(move => {
    const mover = turn.position[move.from]
    if (!mover) return false
    if (mover.piece === POPE) return !isAttacked(turn, move.to, move)
    if (turn.checkers.length > 0 && pope !== null && isAttacked(turn, pope, move)) return false
    if (mover.piece === MARSHAL && move.captures && !turn.riposte) {
      const victim = turn.position[move.to]
      if (victim?.piece !== POPE && !isDefended(turn, move.to)) return false
    }
    if (mover.piece === ASSASSIN && move.captures && isAttackedLegally(turn, move.to, move))
      return false
    return true
  })
}
export const isCheck = (turn: Turn): boolean => turn.checkers.length > 0