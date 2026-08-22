import type { Side, SquareOccupant } from '@/types/material'
import type { Move, State, Position, Save } from '@/types/game'
import { SIZE, FILES } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { EMPEROR, LEGIONARY, BACK_RANK } from '@/constants/piece'
import { PLIES_PER_MOVE, NO_PROGRESS_BASE } from '@/constants/outcome'
import { legality } from './legality'
import { position } from './position'
import { apply } from './apply'
import { repetitionKey, result } from './result'

const setup = (side: Side, back: number, legionaries: number): SquareOccupant => {
  const squares: SquareOccupant = {}
  BACK_RANK.forEach((piece, file) => {
    squares[`${FILES[file]}${back}`] =
      piece === EMPEROR ? { side, piece, awake: false } : { side, piece }
    squares[`${FILES[file]}${legionaries}`] = { side, piece: LEGIONARY }
  })
  return squares
}
export const opening = (): Save => {
  const occupancy = { ...setup(WHITE, 1, 3), ...setup(BLACK, SIZE, SIZE - 2) }
  const state: State = {
    awake: { [WHITE]: false, [BLACK]: false },
    riposte: false,
    castlingSide: {
      [WHITE]: { left: true, right: true },
      [BLACK]: { left: true, right: true }
    },
    promotions: { [WHITE]: [], [BLACK]: [] },
    enPassant: null,
    noProgress: { count: 0, limit: NO_PROGRESS_BASE * PLIES_PER_MOVE }
  }
  return {
    side: WHITE,
    occupancy,
    state,
    match: {
      swap: true,
      whitePlayer: null,
      lastMove: null,
      history: [repetitionKey(WHITE, occupancy, state)],
      pgn: '',
      resigned: null
    }
  }
}
export const clickSquares = (occupancy: SquareOccupant, move: Move): string[] =>
  occupancy[move.from]?.piece === LEGIONARY
    ? [move.to]
    : [...new Set([move.to, ...(move.captures ?? [])])]
export const turn = (
  save: Save,
  move: Move | null
): { save: Save; position: Position; moves: Move[]; result: ReturnType<typeof result> } => {
  const played =
    move === null ? save : apply(position(save.side, save.occupancy, save.state), move, save.match)
  const next = position(played.side, played.occupancy, played.state)
  const moves = legality(next)
  return {
    save: played,
    position: next,
    moves,
    result: result(next, moves, played.match.history, played.match.resigned)
  }
}