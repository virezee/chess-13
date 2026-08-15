import type { Move, Position } from '@/types/game'
import type { Piece, PieceName } from '@/types/material'
import { POPE, EMPEROR, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { parseSquare } from '../lib/coordinate'
import { generate } from './generate'

const blocks = (pope: string, checker: string, square: string): boolean => {
  const origin = parseSquare(pope)
  const target = parseSquare(checker)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  const at = parseSquare(square)
  for (let step = 1; step < distance; step += 1) {
    if (at.file === origin.file + fileStep * step && at.rank === origin.rank + rankStep * step)
      return true
  }
  return false
}
const isEvasion = (
  checkers: readonly string[],
  pope: string | null,
  piece: Piece,
  move: Move
): boolean => {
  if (piece.piece === POPE) return true
  return checkers.every(
    square => move.captures?.includes(square) || (pope !== null && blocks(pope, square, move.to))
  )
}
const onLine = (
  from: string,
  to: string,
  [fileStep, rankStep]: readonly [number, number]
): boolean => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (fileStep === 0) return files === 0 && Math.sign(ranks) === rankStep
  if (rankStep === 0) return ranks === 0 && Math.sign(files) === fileStep
  return (
    Math.abs(files) === Math.abs(ranks) &&
    Math.sign(files) === fileStep &&
    Math.sign(ranks) === rankStep
  )
}
export const candidate = (position: Position): Move[] => {
  const { pieces, occupancy, side, checkInfo, state } = position
  const { checkers, pinned } = checkInfo
  const marshalSquare = pieces[side][MARSHAL][0] ?? null
  const pope = pieces[side][POPE][0] ?? null
  const answering = checkers.some(square => occupancy[square]?.piece === ASSASSIN)
  const doubled = checkers.length > 1 && !answering
  const moves: Move[] = []
  for (const name of Object.keys(pieces[side]) as PieceName[]) {
    if (doubled && name !== POPE && name !== MAGE && name !== ASSASSIN) continue
    for (const square of pieces[side][name]) {
      const piece = occupancy[square]
      if (!piece) continue
      if (name === EMPEROR && piece.awake !== true) continue
      const pin = pinned.get(square)
      if (pin && name === TEMPLAR) continue
      for (const move of generate(
        side,
        name,
        occupancy,
        marshalSquare,
        square,
        state.castlingSide[side],
        state.promotions[side],
        state.enPassant
      )) {
        if (pin && pope !== null && !onLine(pope, move.to, pin)) continue
        if (checkers.length > 0 && !isEvasion(checkers, pope, piece, move)) continue
        moves.push(move)
      }
    }
  }
  return moves
}