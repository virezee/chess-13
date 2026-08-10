import type { Move, Turn } from '@/types/move'
import type { Piece } from '@/types/piece'
import { POPE, MARSHAL } from '@/constants/piece'
import { fromSquare, squareOf } from '@/features/game/lib/square'
import { onLine } from './threats'
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
/**
 * A move worth testing while in check: the Pope walking away, a capture that
 * takes every checker at once, or a block on the line of a lone checker.
 * Anything else cannot answer the check and never reaches the scan.
 */
const couldAnswer = (turn: Turn, pope: string | null, piece: Piece, move: Move): boolean => {
  if (piece.piece === POPE) return true
  if (turn.checkers.every(square => move.captures?.includes(square))) return true
  if (turn.checkers.length !== 1 || pope === null) return false
  return blocks(pope, turn.checkers[0], move.to)
}
/**
 * Every move the side could make by the rules of its pieces. Two restrictions
 * are applied here rather than later, because the walk out from the Pope has
 * already answered both and neither needs the board read again: a pinned piece
 * never leaves its line, and while in check only an answer to the check is worth
 * generating at all.
 */
export const pseudoLegal = (turn: Turn): Move[] => {
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
      turn.enPassant,
      turn.promotionSlots,
      turn.castling
    )) {
      if (pin && pope !== null && !onLine(pope, pin, move.to)) continue
      if (turn.checkers.length > 0 && !couldAnswer(turn, pope, piece, move)) continue
      moves.push(move)
    }
  }
  return moves
}