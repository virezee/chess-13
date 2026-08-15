import type { Move, Turn } from '@/types/game'
import type { Piece } from '@/types/material'
import { POPE, MARSHAL, ASSASSIN, MAGE, TEMPLAR } from '@/constants/piece'
import { fromSquare, squareOf } from '../lib/coordinate'
import { generate } from './generate'

const blocks = (pope: string, checker: string, square: string): boolean => {
  const origin = fromSquare(pope)
  const target = fromSquare(checker)
  const files = target.file - origin.file
  const ranks = target.rank - origin.rank
  if (files !== 0 && ranks !== 0 && Math.abs(files) !== Math.abs(ranks)) return false
  const fileStep = Math.sign(files)
  const rankStep = Math.sign(ranks)
  const distance = Math.max(Math.abs(files), Math.abs(ranks))
  const at = fromSquare(square)
  for (let step = 1; step < distance; step += 1) {
    if (at.file === origin.file + fileStep * step && at.rank === origin.rank + rankStep * step)
      return true
  }
  return false
}
const isEvasion = (turn: Turn, pope: string | null, piece: Piece, move: Move): boolean => {
  if (piece.piece === POPE) return true
  return turn.checkers.every(
    square => move.captures?.includes(square) || (pope !== null && blocks(pope, square, move.to))
  )
}
export const onLine = (
  from: string,
  to: string,
  [fileStep, rankStep]: readonly [number, number]
): boolean => {
  const origin = fromSquare(from)
  const target = fromSquare(to)
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
export const candidate = (turn: Turn): Move[] => {
  const { side, position } = turn
  const marshalSquare = squareOf(side, MARSHAL, position)
  const pope = squareOf(side, POPE, position)
  const moves: Move[] = []
  const doubled = turn.checkers.length > 1
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side !== side) continue
    if (doubled && piece.piece !== POPE && piece.piece !== MAGE && piece.piece !== ASSASSIN)
      continue
    const pin = turn.pinned.get(square)
    if (pin && piece.piece === TEMPLAR) continue
    for (const move of generate(
      side,
      piece.piece,
      position,
      marshalSquare,
      square,
      turn.rights.castling[side],
      turn.rights.enPassant,
      turn.promotionSlots[side]
    )) {
      if (pin && pope !== null && !onLine(pope, move.to, pin)) continue
      if (turn.checkers.length > 0 && !isEvasion(turn, pope, piece, move)) continue
      moves.push(move)
    }
  }
  return moves
}