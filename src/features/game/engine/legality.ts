import type { Side, Piece, SquareOccupant } from '@/types/material'
import type { Board, CheckInfo, Step, Move, View, State, Position } from '@/types/game'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { parseSquare, makeSquare, isOnBoard } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { isReachable, isAssassinReachable, threats } from './threats'
import { candidate } from './candidate'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
const makeMove = (occupancy: SquareOccupant, awake: State['awake'], move: Move): View => {
  const mover = occupancy[move.from]
  const vacated = [move.from, ...(move.captures ?? [])]
  const dies = move.captures?.includes(move.from) ?? false
  if (!mover || dies) return { vacated }
  const piece: Piece = move.promotesTo
    ? move.promotesTo === EMPEROR
      ? { side: mover.side, piece: EMPEROR, awake: awake[mover.side] }
      : { side: mover.side, piece: move.promotesTo }
    : mover
  return { moved: { piece, square: move.to }, vacated }
}
const castlingPath = ({ from, to }: Step): string[] => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const fileStep = Math.sign(target.file - origin.file)
  const squares: string[] = []
  for (let file = origin.file + fileStep; file !== target.file + fileStep; file += fileStep)
    squares.push(makeSquare({ file, rank: origin.rank }))
  return squares
}
const isInRing = ({ from, to }: Step): boolean => {
  const { file: ff, rank: fr } = parseSquare(from)
  const { file: tf, rank: tr } = parseSquare(to)
  return Math.max(Math.abs(ff - tf), Math.abs(fr - tr)) === 1
}
const scanLine = (
  pope: string,
  side: Side,
  occupancy: SquareOccupant,
  fileStep: number,
  rankStep: number
): { occupant: Piece; square: string; blocker: string | null; distance: number } | null => {
  const origin = parseSquare(pope)
  let blocker: string | null = null
  for (let distance = 1; distance <= SIZE; distance += 1) {
    const file = origin.file + fileStep * distance
    const rank = origin.rank + rankStep * distance
    if (!isOnBoard({ file, rank })) return null
    const square = makeSquare({ file, rank })
    const occupant = occupancy[square]
    if (!occupant) continue
    if (occupant.side === side) {
      if (blocker !== null) return null
      blocker = square
      continue
    }
    return { square, occupant, blocker, distance }
  }
  return null
}
const sliderCheckers = (
  board: Board,
  pope: string,
  side: Side,
  enemyPope: string,
  enemyMarshal: string | null,
  pinned: CheckInfo['pinned']
): string[] => {
  const { occupancy } = board
  const origin = parseSquare(pope)
  const checkers: string[] = []
  for (const [fileStep, rankStep] of EVERY) {
    const line = scanLine(pope, side, occupancy, fileStep, rankStep)
    if (line === null) continue
    const { occupant, square, blocker, distance } = line
    const enhanced = isEnhanced(enemyMarshal, square)
    let isAttacked: boolean
    switch (occupant.piece) {
      case MARSHAL:
        isAttacked = true
        break
      case ASSASSIN: {
        const dest = CORNERS.includes(pope)
          ? pope
          : makeSquare({ file: origin.file - fileStep, rank: origin.rank - rankStep })
        isAttacked =
          isAssassinReachable(occupancy, {}, pope, fileStep, rankStep, enhanced, distance) &&
          !threats(board, side, {}, false, dest).some(defender => defender !== pope)
        break
      }
      case MAGE:
        isAttacked = distance === 1 && !isInRing({ from: square, to: enemyPope })
        break
      default:
        isAttacked = isReachable(
          occupant,
          false,
          fileStep !== 0 && rankStep !== 0,
          rankStep,
          enhanced,
          distance
        )
    }
    if (!isAttacked) continue
    if (blocker === null) checkers.push(square)
    else pinned.set(blocker, [fileStep, rankStep])
  }
  return checkers
}
const isLeap = (
  fileDelta: number,
  rankDelta: number,
  offsets: readonly (readonly [number, number])[]
): boolean =>
  offsets.some(([fileStep, rankStep]) => fileStep === fileDelta && rankStep === rankDelta)
const templarCheckers = (
  pope: string,
  enemyMarshal: string | null,
  enemyTemplars: string[]
): string[] => {
  const origin = parseSquare(pope)
  const checkers: string[] = []
  for (const templar of enemyTemplars) {
    const { file, rank } = parseSquare(templar)
    const fileDelta = file - origin.file
    const rankDelta = rank - origin.rank
    if (
      isLeap(fileDelta, rankDelta, LEAP_3_2) ||
      (isLeap(fileDelta, rankDelta, LEAP_2_1) && isEnhanced(enemyMarshal, templar))
    )
      checkers.push(templar)
  }
  return checkers
}
export const checkInfo = (board: Board, side: Side): CheckInfo => {
  const { pieces } = board
  const pinned: CheckInfo['pinned'] = new Map()
  const pope = pieces[side][POPE][0]!
  const enemy = opponent(side)
  const enemyPope = pieces[enemy][POPE][0]!
  const enemyMarshal = pieces[enemy][MARSHAL][0] ?? null
  const checkers = [
    ...sliderCheckers(board, pope, side, enemyPope, enemyMarshal, pinned),
    ...templarCheckers(pope, enemyMarshal, pieces[enemy][TEMPLAR])
  ]
  return { checkers, pinned }
}
export const dormantSquare = (board: Board, side: Side): string | null => {
  const { pieces, occupancy } = board
  const square = pieces[side][EMPEROR][0] ?? null
  if (square === null) return null
  return occupancy[square]?.awake === true ? null : square
}
export const legality = (position: Position): Move[] => {
  const { pieces, occupancy, side, checkInfo: info, state } = position
  const enemy = opponent(side)
  const pope = pieces[side][POPE][0]!
  const enemyMarshal = pieces[enemy][MARSHAL][0] ?? null
  const dormantSq = dormantSquare(position, enemy)
  return candidate(position).filter(move => {
    const mover = occupancy[move.from]
    if (!mover) return false
    const view = makeMove(occupancy, state.awake, move)
    const popeAfter = mover.piece === POPE ? move.to : pope
    if (
      dormantSq !== null &&
      ((enemyMarshal !== null && move.captures?.includes(enemyMarshal)) ||
        threats(position, side, view, false, dormantSq).length > 0) &&
      threats(position, enemy, view, true, popeAfter).includes(dormantSq)
    )
      return false
    if (mover.piece === POPE) {
      if (!move.sentinel) return threats(position, enemy, view, false, move.to).length === 0
      if (info.checkers.length > 0) return false
      return castlingPath(move).every(square => {
        const crossing = { vacated: [move.from], moved: { square, piece: mover } }
        return threats(position, enemy, crossing, false, square).length === 0
      })
    }
    if (
      (info.checkers.length > 0 || move.captures?.some(square => square !== move.to)) &&
      threats(position, enemy, view, false, pope).length > 0
    )
      return false
    if (
      mover.piece === MARSHAL &&
      move.captures &&
      !state.riposte &&
      occupancy[move.to]?.piece !== POPE &&
      threats(position, side, {}, false, move.to).length === 0
    )
      return false
    return !(
      mover.piece === ASSASSIN &&
      move.captures &&
      threats(position, enemy, view, false, move.to).length > 0
    )
  })
}