import type { Move, Turn } from '@/types/move'
import type { Piece } from '@/types/piece'
import { POPE, MARSHAL } from '@/constants/piece'
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
  if (turn.checkers.every(square => move.captures?.includes(square))) return true
  if (turn.checkers.length !== 1 || pope === null) return false
  return blocks(pope, turn.checkers[0], move.to)
}
export const onLine = (
  [fileStep, rankStep]: readonly [number, number],
  from: string,
  to: string
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
  for (const [square, piece] of Object.entries(position)) {
    if (piece.side !== side) continue
    const pin = turn.pinned.get(square)
    for (const move of generate(
      side,
      piece.piece,
      position,
      marshalSquare,
      square,
      turn.castling,
      turn.enPassant,
      turn.promotionSlots
    )) {
      if (pin && pope !== null && !onLine(pin, pope, move.to)) continue
      if (turn.checkers.length > 0 && !isEvasion(turn, pope, piece, move)) continue
      moves.push(move)
    }
  }
  return moves
}