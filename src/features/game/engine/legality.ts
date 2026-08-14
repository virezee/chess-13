import type { Side, PieceList, Position } from '@/types/piece'
import type { Move, View, Turn } from '@/types/move'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { fromSquare, toSquare, isOnBoard, squareOf } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { occupantAt, reaches, assassinReaches, threats } from './threats'
import { onLine, candidate } from './candidate'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
const adjacent = (from: string, to: string): boolean => {
  const one = fromSquare(from)
  const two = fromSquare(to)
  return Math.max(Math.abs(one.file - two.file), Math.abs(one.rank - two.rank)) === 1
}
const isLeap = (
  offsets: readonly (readonly [number, number])[],
  files: number,
  ranks: number
): boolean => offsets.some(([fileStep, rankStep]) => fileStep === files && rankStep === ranks)
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
  pieces: Record<Side, PieceList>,
  position: Position,
  view: View = {}
): { checkers: string[]; pinned: Map<string, readonly [number, number]> } => {
  const checkers: string[] = []
  const pinned = new Map<string, readonly [number, number]>()
  const pope = pieces[side][POPE][0] ?? null
  const enemy = opponent(side)
  const enemyMarshal = pieces[enemy][MARSHAL][0] ?? null
  const enemyPope = pieces[enemy][POPE][0] ?? null
  const origin = fromSquare(pope!)
  const assassins: {
    at: string
    shield: string | null
    step: readonly [number, number]
    enhanced: boolean
    distance: number
  }[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    let shield: string | null = null
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
        continue
      }
      const enhanced = isEnhanced(enemyMarshal, at)
      if (occupant.piece === ASSASSIN) {
        assassins.push({ at, shield, step: [fileStep, rankStep], enhanced, distance })
        break
      }
      const hits =
        occupant.piece === MARSHAL
          ? true
          : occupant.piece === MAGE
            ? distance === 1 && (enemyPope === null || !adjacent(at, enemyPope))
            : reaches(occupant, false, isDiagonal, rankStep, enhanced, distance)
      if (hits) {
        if (shield === null) checkers.push(at)
        else pinned.set(shield, [fileStep, rankStep])
      }
      break
    }
  }
  for (const at of pieces[enemy][TEMPLAR]) {
    const occupant = occupantAt(position, view, at)
    if (occupant?.side !== enemy || occupant.piece !== TEMPLAR) continue
    const { file, rank } = fromSquare(at)
    const files = file - origin.file
    const ranks = rank - origin.rank
    if (
      isLeap(LEAP_3_2, files, ranks) ||
      (isLeap(LEAP_2_1, files, ranks) && isEnhanced(enemyMarshal, at))
    )
      checkers.push(at)
  }
  for (const { at, shield, step, enhanced, distance } of assassins) {
    const [fileStep, rankStep] = step
    if (!assassinReaches(position, view, pope!, fileStep, rankStep, enhanced, distance)) continue
    const lands = CORNERS.includes(pope!)
      ? pope!
      : toSquare(origin.file - fileStep, origin.rank - rankStep)
    const guarded = threats(side, position, lands, false, view).some(from => {
      if (from === pope) return false
      const pin = pinned.get(from)
      return !pin || onLine(pope!, lands, pin)
    })
    if (guarded) continue
    if (shield === null) checkers.push(at)
    else pinned.set(shield, [fileStep, rankStep])
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
  pieces: Record<Side, PieceList>,
  position: Position,
  square: string,
  view: View = {}
): boolean => {
  const found = threats(by, position, square, false, view)
  if (found.length === 0) return false
  const pope = pieces[by][POPE][0] ?? null
  const { pinned } = scanPope(by, pieces, position, view)
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
      isAttackedLegally(turn.side, turn.pieces, turn.position, dormant, view) &&
      threats(enemy, turn.position, guarded, true, view).includes(dormant)
    )
      return false
    if (mover.piece === POPE) {
      if (!move.sentinel) return threats(enemy, turn.position, move.to, false, view).length === 0
      if (turn.checkers.length > 0) return false
      return path(move.from, move.to).every(
        square =>
          threats(enemy, turn.position, square, false, {
            vacated: [move.from],
            moved: { square, piece: mover }
          }).length === 0
      )
    }
    const empties = move.captures?.some(square => square !== move.to) ?? false
    if (
      pope !== null &&
      (turn.checkers.length > 0 || empties) &&
      threats(enemy, turn.position, pope, false, view).length > 0
    )
      return false
    if (mover.piece === MARSHAL && move.captures && !turn.rights.riposte) {
      const victim = turn.position[move.to]
      if (victim?.piece !== POPE && threats(turn.side, turn.position, move.to, false).length === 0)
        return false
    }
    if (
      mover.piece === ASSASSIN &&
      move.captures &&
      isAttackedLegally(opponent(turn.side), turn.pieces, turn.position, move.to, view)
    )
      return false
    return true
  })
}