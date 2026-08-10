import type { Move } from '@/types/move'
import type { Position } from '@/types/piece'
import { POPE, ASSASSIN, MARSHAL } from '@/constants/piece'
import { squareOf } from '@/features/game/lib/square'
import { attackersOf, scanPope, onLine, opponent } from './threats'
import type { View } from './threats'
import { pseudoLegal } from './attacks'
import type { Turn } from './turn'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
/** The board as it stands once this move has been made, without copying it. */
const after = (position: Position, move: Move): View => {
  const mover = position[move.from]
  const vacated = [move.from, ...(move.captures ?? [])]
  const dies = move.captures?.includes(move.from) ?? false
  if (!mover || dies) return { vacated }
  return { vacated, moved: { square: move.to, piece: mover } }
}
/** The Pope may not walk onto a square the enemy bears on once it has left. */
const popeIsSafe = (turn: Turn, move: Move): boolean =>
  attackersOf(opponent(turn.side), turn.position, move.to, after(turn.position, move), true)
    .length === 0
/** In check, every other move has to leave the Pope unattacked. */
const checkIsAnswered = (turn: Turn, pope: string, move: Move): boolean =>
  attackersOf(opponent(turn.side), turn.position, pope, after(turn.position, move), true).length ===
  0
/**
 * The Marshal takes only what its own army already attacks. Support is
 * geometric, so a pinned attacker counts in every direction it bears on. The
 * riposte lifts the requirement outright, and the enemy Pope never needs it.
 */
const marshalIsSupported = (turn: Turn, move: Move): boolean => {
  if (turn.riposte) return true
  const target = turn.position[move.to]
  if (target && target.piece === POPE) return true
  return attackersOf(turn.side, turn.position, move.to).length > 0
}
/**
 * An Assassin may not land where the enemy could legally take it. The scan
 * stands on the landing tile; if it turns anything up, one more walk out from
 * the enemy Pope says which of those are pinned, and the first one that may
 * really capture ends it.
 */
const assassinIsSafe = (turn: Turn, move: Move): boolean => {
  const view = after(turn.position, move)
  const enemy = opponent(turn.side)
  const found = attackersOf(enemy, turn.position, move.to, view)
  if (found.length === 0) return true
  const theirPope = squareOf(enemy, POPE, turn.position)
  const { pinned } = scanPope(enemy, turn.position, view)
  return !found.some(from => {
    const pin = pinned.get(from)
    return !pin || theirPope === null || onLine(theirPope, pin, move.to)
  })
}
/**
 * One walk out from your own Pope. The first piece on each ray answers check,
 * and carrying on past your own first piece answers pin. Leapers and one
 * steppers can never pin, so they are asked about check only.
 */
// export const scanPope = (side: Side, position: Position, view: View = NOW): PopeScan => {
//   const checkers: string[] = []
//   const pinned = new Map<string, readonly [number, number]>()
//   const pope = squareOf(side, POPE, position)
//   const enemy = opponent(side)
//   const enemyMarshal = squareOf(enemy, MARSHAL, position)
//   const origin = fromSquare(pope!)
//   for (const [fileStep, rankStep] of EVERY) {
//     const isDiagonal = fileStep !== 0 && rankStep !== 0
//     let shield: string | null = null
//     let shieldAt = 0
//     for (let distance = 1; distance <= SIZE; distance += 1) {
//       const file = origin.file + fileStep * distance
//       const rank = origin.rank + rankStep * distance
//       if (!isOnBoard(file, rank)) break
//       const at = toSquare(file, rank)
//       const occupant = occupantAt(position, view, at)
//       if (!occupant) continue
//       if (occupant.side === side) {
//         if (shield !== null) break
//         shield = at
//         shieldAt = distance
//         continue
//       }
//       const gap = distance - shieldAt
//       const enhanced = isEnhanced(enemyMarshal, at)
//       const hits =
//         occupant.piece === MARSHAL
//           ? shield === null
//           : occupant.piece === ASSASSIN
//             ? assassinReaches(position, view, shield ?? pope!, fileStep, rankStep, gap, enhanced)
//             : reaches(occupant, enhanced, rankStep, isDiagonal, gap)
//       if (hits) {
//         if (shield === null) checkers.push(at)
//         else pinned.set(shield, [fileStep, rankStep])
//       }
//       break
//     }
//   }
//   for (const from of attackersOf(enemy, position, pope!, view, true)) {
//     if (!checkers.includes(from)) checkers.push(from)
//   }
//   return { checkers, pinned }
// }
export const legal = (turn: Turn): Move[] => {
  const pope = squareOf(turn.side, POPE, turn.position)
  return pseudoLegal(turn).filter(move => {
    const mover = turn.position[move.from]
    if (!mover) return false
    if (mover.piece === POPE) return popeIsSafe(turn, move)
    if (turn.checkers.length > 0 && pope !== null && !checkIsAnswered(turn, pope, move))
      return false
    if (mover.piece === MARSHAL && move.captures && !marshalIsSupported(turn, pope, move)) {
      return false
    }
    if (mover.piece === ASSASSIN && move.captures && !assassinIsSafe(turn, move)) return false
    return true
  })
}
export const isCheck = (turn: Turn): boolean => turn.checkers.length > 0