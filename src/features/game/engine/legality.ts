import type { Side, Piece, SquareOccupant } from '@/types/material'
import type { Board, CheckInfo, Step, Move, View, Position } from '@/types/game'
import { SIZE, CORNERS } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { EVERY, LEAP_3_2, LEAP_2_1 } from '@/constants/direction'
import { parseSquare, makeSquare, isOnBoard } from '../lib/coordinate'
import { isEnhanced } from './generate'
import { reaches, assassinReaches, threats } from './threats'
import { candidate } from './candidate'

const opponent = (side: Side): Side => (side === WHITE ? BLACK : WHITE)
const makeMove = (occupancy: SquareOccupant, move: Move): View => {
  const mover = occupancy[move.from]
  const vacated = [move.from, ...(move.captures ?? [])]
  const dies = move.captures?.includes(move.from) ?? false
  if (!mover || dies) return { vacated }
  return { moved: { piece: mover, square: move.to }, vacated }
}
const castlingPath = ({ from, to }: Step): string[] => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const step = Math.sign(target.file - origin.file)
  const squares: string[] = []
  for (let file = origin.file + step; file !== target.file + step; file += step)
    squares.push(makeSquare(file, origin.rank))
  return squares
}
const isInRing = ({ from, to }: Step): boolean => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  return Math.max(Math.abs(origin.file - target.file), Math.abs(origin.rank - target.rank)) === 1
}
const isLeap = (
  files: number,
  ranks: number,
  offsets: readonly (readonly [number, number])[]
): boolean => offsets.some(([fileStep, rankStep]) => fileStep === files && rankStep === ranks)
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
    if (!isOnBoard(file, rank)) return null
    const square = makeSquare(file, rank)
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
  enemyPope: string | null,
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
    let hits: boolean
    switch (occupant.piece) {
      case MARSHAL:
        hits = true
        break
      case ASSASSIN: {
        const destination = CORNERS.includes(pope)
          ? pope
          : makeSquare(origin.file - fileStep, origin.rank - rankStep)
        hits =
          assassinReaches(occupancy, {}, pope, fileStep, rankStep, enhanced, distance) &&
          !threats(board, side, {}, false, destination).some(from => from !== pope)
        break
      }
      case MAGE:
        hits = distance === 1 && (enemyPope === null || !isInRing({ from: square, to: enemyPope }))
        break
      default:
        hits = reaches(
          occupant,
          false,
          fileStep !== 0 && rankStep !== 0,
          rankStep,
          enhanced,
          distance
        )
    }
    if (!hits) continue
    if (blocker === null) checkers.push(square)
    else pinned.set(blocker, [fileStep, rankStep])
  }
  return checkers
}
const templarCheckers = (
  pope: string,
  enemyMarshal: string | null,
  enemyTemplars: string[]
): string[] => {
  const origin = parseSquare(pope)
  const checkers: string[] = []
  for (const templar of enemyTemplars) {
    const { file, rank } = parseSquare(templar)
    const files = file - origin.file
    const ranks = rank - origin.rank
    if (
      isLeap(files, ranks, LEAP_3_2) ||
      (isLeap(files, ranks, LEAP_2_1) && isEnhanced(enemyMarshal, templar))
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
  const enemyMarshal = pieces[enemy][MARSHAL][0] ?? null
  const enemyPope = pieces[enemy][POPE][0] ?? null
  const checkers = [
    ...sliderCheckers(board, pope, side, enemyPope, enemyMarshal, pinned),
    ...templarCheckers(pope, enemyMarshal, pieces[enemy][TEMPLAR])
  ]
  return { checkers, pinned }
}
export const dormantEmperor = (board: Board, side: Side): string | null => {
  const { pieces, occupancy } = board
  const square = pieces[side][EMPEROR][0] ?? null
  if (square === null) return null
  return occupancy[square]?.awake === true ? null : square
}
export const legality = (position: Position): Move[] => {
  const { pieces, occupancy, side, checkInfo: info, state } = position
  const enemy = opponent(side)
  const pope = pieces[side][POPE][0] ?? null
  const enemyMarshal = pieces[enemy][MARSHAL][0] ?? null
  const dormant = dormantEmperor(position, enemy)
  return candidate(position).filter(move => {
    const mover = occupancy[move.from]
    if (!mover) return false
    const view = makeMove(occupancy, move)
    const guarded = mover.piece === POPE ? move.to : pope
    if (
      dormant !== null &&
      guarded !== null &&
      ((enemyMarshal !== null && move.captures?.includes(enemyMarshal)) ||
        threats(position, side, view, false, dormant).length > 0) &&
      threats(position, enemy, view, true, guarded).includes(dormant)
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
      pope !== null &&
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