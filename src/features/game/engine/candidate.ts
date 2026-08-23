import type { Board, Move, State, Position } from '@/types/game'
import type { Side, PieceName, Piece } from '@/types/material'
import { CORNERS } from '@/constants/board'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE } from '@/constants/piece'
import { parseSquare, makeSquare } from '../lib/coordinate'
import { generate } from './generate'
import { threats } from './threats'

const isBlocking = (pope: string, checker: string, square: string): boolean => {
  const origin = parseSquare(pope)
  const target = parseSquare(checker)
  const fileDelta = target.file - origin.file
  const rankDelta = target.rank - origin.rank
  if (fileDelta !== 0 && rankDelta !== 0 && Math.abs(fileDelta) !== Math.abs(rankDelta))
    return false
  const fileStep = Math.sign(fileDelta)
  const rankStep = Math.sign(rankDelta)
  const fromOrigin = Math.max(Math.abs(fileDelta), Math.abs(rankDelta))
  const blocker = parseSquare(square)
  for (let distance = 1; distance < fromOrigin; distance += 1) {
    if (
      blocker.file === origin.file + fileStep * distance &&
      blocker.rank === origin.rank + rankStep * distance
    )
      return true
  }
  return false
}
const isEvasion = (
  board: Board,
  side: Side,
  pope: string,
  awake: State['awake'],
  checkers: readonly string[],
  piece: Piece,
  move: Move
): boolean => {
  if (piece.piece === POPE) return true
  const origin = parseSquare(pope)
  const promoted: Piece = move.promotesTo
    ? move.promotesTo === EMPEROR
      ? { side, piece: EMPEROR, awake: awake[side] }
      : { side, piece: move.promotesTo }
    : piece
  return checkers.every(checker => {
    if (move.captures?.includes(checker) || isBlocking(pope, checker, move.to)) return true
    if (board.occupancy[checker]?.piece !== ASSASSIN) return false
    const target = parseSquare(checker)
    const dest = CORNERS.includes(pope)
      ? pope
      : makeSquare({
          file: origin.file + Math.sign(origin.file - target.file),
          rank: origin.rank + Math.sign(origin.rank - target.rank)
        })
    if (move.to === dest) return true
    const view = {
      moved: { piece: promoted, square: move.to },
      vacated: [move.from, ...(move.captures ?? [])]
    }
    return threats(board, side, view, false, dest).some(defender => defender !== pope)
  })
}
export const candidate = (position: Position): Move[] => {
  const { pieces, occupancy, side, checkers, state } = position
  const pope = pieces[side][POPE][0]!
  const marshalSq = pieces[side][MARSHAL][0] ?? null
  const isAssCheck = checkers.some(square => occupancy[square]?.piece === ASSASSIN)
  const isDoubleCheck = checkers.length > 1 && !isAssCheck
  const moves: Move[] = []
  for (const name of Object.keys(pieces[side]) as PieceName[]) {
    if (isDoubleCheck && name !== POPE && name !== MAGE && name !== ASSASSIN) continue
    for (const square of pieces[side][name]) {
      const piece = occupancy[square]
      if (!piece) continue
      if (name === EMPEROR && piece.awake !== true) continue
      for (const move of generate(
        side,
        name,
        occupancy,
        marshalSq,
        square,
        state.castlingSide[side],
        state.promotions[side],
        state.enPassant
      )) {
        if (
          checkers.length > 0 &&
          !isEvasion(position, side, pope, state.awake, checkers, piece, move)
        )
          continue
        moves.push(move)
      }
    }
  }
  return moves
}