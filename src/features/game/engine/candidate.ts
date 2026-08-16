import type { Move, Step, Position } from '@/types/game'
import type { PieceName, Piece } from '@/types/material'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { parseSquare } from '../lib/coordinate'
import { generate } from './generate'

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
  pope: string,
  checkers: readonly string[],
  piece: Piece,
  move: Move
): boolean => {
  if (piece.piece === POPE) return true
  return checkers.every(
    checker => move.captures?.includes(checker) || isBlocking(pope, checker, move.to)
  )
}
const isAligned = (
  { from, to }: Step,
  [fileStep, rankStep]: readonly [number, number]
): boolean => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const fileDelta = target.file - origin.file
  const rankDelta = target.rank - origin.rank
  if (fileStep === 0) return fileDelta === 0 && Math.sign(rankDelta) === rankStep
  if (rankStep === 0) return rankDelta === 0 && Math.sign(fileDelta) === fileStep
  return (
    Math.abs(fileDelta) === Math.abs(rankDelta) &&
    Math.sign(fileDelta) === fileStep &&
    Math.sign(rankDelta) === rankStep
  )
}
export const candidate = (position: Position): Move[] => {
  const { pieces, occupancy, side, checkInfo, state } = position
  const { checkers, pinned } = checkInfo
  const pope = pieces[side][POPE][0]!
  const marshalSq = pieces[side][MARSHAL][0] ?? null
  const isAssCheck = checkers.some(square => occupancy[square]?.piece === ASSASSIN)
  const doubleCheck = checkers.length > 1 && !isAssCheck
  const moves: Move[] = []
  for (const name of Object.keys(pieces[side]) as PieceName[]) {
    if (doubleCheck && name !== POPE && name !== MAGE && name !== ASSASSIN) continue
    for (const square of pieces[side][name]) {
      const piece = occupancy[square]
      if (!piece) continue
      if (name === EMPEROR && piece.awake !== true) continue
      const pinDirection = pinned.get(square)
      if (pinDirection && name === TEMPLAR) continue
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
        if (pinDirection && !isAligned({ from: pope, to: move.to }, pinDirection)) continue
        if (checkers.length > 0 && !isEvasion(pope, checkers, piece, move)) continue
        moves.push(move)
      }
    }
  }
  return moves
}