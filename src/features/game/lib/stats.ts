import type { Side, PieceName, PieceSquares } from '@/types/material'
import type { Position } from '@/types/game'
import type { ArmyState } from '@/types/panel'
import { SIZE, FILES, COMMAND_SQUARE } from '@/constants/board'
import { POPE, EMPEROR, MARSHAL, LEGIONARY, BACK_RANK, LETTER, VALUE } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { isEnhanced } from '../engine/generate'

const captured = (pieces: PieceSquares): ArmyState['captured'] =>
  Object.entries(
    (() => {
      const count: Partial<Record<PieceName, number>> = { [LEGIONARY]: SIZE }
      for (const piece of BACK_RANK) count[piece] = (count[piece] ?? 0) + 1
      return count
    })()
  ).flatMap(([name, start]) =>
    Array.from({ length: (start ?? 0) - pieces[name as PieceName].length }, (_, i) => ({
      id: `${name}${i}`,
      letter: LETTER[name as PieceName]
    }))
  )
export const fileRange = (file: number): string => {
  const first = Math.max(0, file - 1)
  const last = Math.min(FILES.length - 1, file + 1)
  return `${FILES[first]}-${FILES[last]}`
}
export const material = (position: Position, side: Side): number => {
  const marshalSq = position.pieces[side][MARSHAL][0] ?? null
  return Object.entries(position.occupancy).reduce(
    (total, [square, piece]) =>
      piece.side !== side || piece.piece === POPE
        ? total
        : total + VALUE[piece.piece][isEnhanced(marshalSq, square) ? ENHANCED : RESTRICTED],
    0
  )
}
export const army = (position: Position, side: Side, player: string): ArmyState => {
  const { pieces, occupancy, state } = position
  const marshalSquare = pieces[side][MARSHAL][0] ?? null
  const emperorSq = pieces[side][EMPEROR][0] ?? null
  const remaining = Object.entries(occupancy).filter(
    ([, piece]) =>
      piece.side === side &&
      piece.piece !== POPE &&
      piece.piece !== EMPEROR &&
      piece.piece !== MARSHAL
  )
  return {
    player,
    side,
    emperor: emperorSq === null ? null : occupancy[emperorSq]?.awake === true ? 'awake' : 'dormant',
    marshalSquare,
    commandZone:
      marshalSquare === null ? 'none' : marshalSquare === COMMAND_SQUARE ? 'full' : 'partial',
    pieceCount: remaining.length,
    enhancedCount: remaining.filter(([square]) => isEnhanced(marshalSquare, square)).length,
    captured: captured(pieces[side]),
    promotions: state.promotions[side],
    material: material(position, side)
  }
}