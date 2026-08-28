import type { Side, Piece, SquareOccupant } from '@/types/material'
import type { Board, View } from '@/types/game'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/player'
import {
  POPE,
  EMPEROR,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY,
  REACH
} from '@/constants/piece'
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { parseSquare, makeSquare, isOnBoard } from '../lib/coordinate'
import { isEnhanced } from './generate'

const occupantAt = (occupancy: SquareOccupant, view: View, square: string): Piece | undefined => {
  if (view.moved && view.moved.square === square) return view.moved.piece
  if (view.vacated?.includes(square)) return
  return occupancy[square]
}
const marshalAt = (side: Side, view: View, marshalSquare: string | null): string | null => {
  const moved = view.moved
  if (moved?.piece.piece === MARSHAL && moved.piece.side === side) return moved.square
  if (marshalSquare === null || view.vacated?.includes(marshalSquare)) return null
  return marshalSquare
}
const hopped = (view: View, square: string): View =>
  view.moved?.square === square
    ? { vacated: [...(view.vacated ?? []), square] }
    : { ...view, vacated: [...(view.vacated ?? []), square] }
const isLandingClear = (
  board: Board,
  side: Side,
  view: View,
  square: string,
  dest: string,
  chain: readonly string[]
): boolean => {
  const key = `${side}${square}`
  if (chain.includes(key)) return true
  return (
    threats(board, side === WHITE ? BLACK : WHITE, hopped(view, square), false, dest, [
      ...chain,
      key
    ]).length === 0
  )
}
const leapers = (
  board: Board,
  side: Side,
  view: View,
  marshalSquare: string | null,
  square: string
): string[] => {
  const { pieces, occupancy } = board
  if (pieces[side][TEMPLAR].length === 0) return []
  const target = parseSquare(square)
  const templars: string[] = []
  for (const [offsets, enhancedOnly] of [
    [LEAP_3_2, false],
    [LEAP_2_1, true]
  ] as const) {
    for (const [fileStep, rankStep] of offsets) {
      const file = target.file + fileStep
      const rank = target.rank + rankStep
      if (!isOnBoard({ file, rank })) continue
      const from = makeSquare({ file, rank })
      const occupant = occupantAt(occupancy, view, from)
      if (!occupant || occupant.side !== side || occupant.piece !== TEMPLAR) continue
      if (enhancedOnly && !isEnhanced(marshalSquare, from)) continue
      templars.push(from)
    }
  }
  return templars
}
export const isReachable = (
  piece: Piece,
  dormant: boolean,
  isDiagonal: boolean,
  rankStep: number,
  enhanced: boolean,
  distance: number
): boolean => {
  switch (piece.piece) {
    case POPE:
      return distance === 1
    case EMPEROR:
      return piece.awake === true || dormant
    case SENTINEL:
      return !isDiagonal && distance <= REACH.sentinel[enhanced ? ENHANCED : RESTRICTED].capture
    case HERALD:
      return isDiagonal
        ? distance <= REACH.herald[enhanced ? ENHANCED : RESTRICTED].diagonal
        : distance === 1 && enhanced
    case LEGIONARY:
      return isDiagonal && distance === 1 && rankStep === (piece.side === WHITE ? -1 : 1)
    default:
      return false
  }
}
export const isAssassinReachable = (
  occupancy: SquareOccupant,
  view: View,
  square: string,
  fileStep: number,
  rankStep: number,
  enhanced: boolean,
  distance: number
): boolean => {
  const reach = REACH.assassin[enhanced ? ENHANCED : RESTRICTED].reach
  if (CORNERS.includes(square)) return distance <= reach
  if (distance + 1 > reach) return false
  const target = parseSquare(square)
  const file = target.file - fileStep
  const rank = target.rank - rankStep
  if (!isOnBoard({ file, rank })) return false
  return !occupantAt(occupancy, view, makeSquare({ file, rank }))
}
export const threats = (
  board: Board,
  side: Side,
  view: View = {},
  dormant: boolean,
  square: string,
  chain: readonly string[] = []
): string[] => {
  const { pieces, occupancy } = board
  const popeSq = parseSquare(pieces[side][POPE][0]!)
  const marshalSq = marshalAt(side, view, pieces[side][MARSHAL][0] ?? null)
  const target = parseSquare(square)
  const targetPiece = occupantAt(occupancy, view, square)
  const isEnemyPope = targetPiece?.piece === POPE && targetPiece.side !== side
  const attackers: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const isDiagonal = fileStep !== 0 && rankStep !== 0
    for (let distance = 1; distance <= SIZE; distance += 1) {
      const file = target.file + fileStep * distance
      const rank = target.rank + rankStep * distance
      if (!isOnBoard({ file, rank })) break
      const attacker = makeSquare({ file, rank })
      const occupant = occupantAt(occupancy, view, attacker)
      if (!occupant) continue
      if (occupant.side !== side) break
      const enhanced = isEnhanced(marshalSq, attacker)
      if (occupant.piece === MARSHAL) {
        if (isEnemyPope) attackers.push(attacker)
      } else if (occupant.piece === ASSASSIN) {
        const dest = CORNERS.includes(square)
          ? square
          : makeSquare({ file: target.file - fileStep, rank: target.rank - rankStep })
        if (
          isAssassinReachable(occupancy, view, square, fileStep, rankStep, enhanced, distance) &&
          isLandingClear(board, side, view, square, dest, chain)
        )
          attackers.push(attacker)
      } else if (occupant.piece === MAGE) {
        const isInRing = Math.max(Math.abs(popeSq.file - file), Math.abs(popeSq.rank - rank)) === 1
        if (distance === 1 && (enhanced || !(isEnemyPope && isInRing))) attackers.push(attacker)
      } else if (isReachable(occupant, dormant, isDiagonal, rankStep, enhanced, distance))
        attackers.push(attacker)
      break
    }
  }
  attackers.push(...leapers(board, side, view, marshalSq, square))
  return attackers
}