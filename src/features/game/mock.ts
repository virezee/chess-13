import { FILES } from '@/constants/board'
import type { ArmyState, GameCounters, LoggedTurn, PieceName, Position, Side } from '../../types/types'

/**
 * Placeholder state so the shell can be judged before the engine exists.
 * Every value here is shaped the way the engine will eventually return it.
 */

export const turnToMove: Side = 'white'

export const blackArmy: ArmyState = {
  side: 'black',
  player: 'Player 2',
  marshalSquare: 'g7',
  aura: 'command',
  strongCount: 24,
  pieceCount: 24,
  lost: ['L', 'G'],
  promotionSlots: [{ piece: 'mage', file: 9 }],
  material: 88.5
}

export const whiteArmy: ArmyState = {
  side: 'white',
  player: 'Player 1',
  marshalSquare: 'h5',
  aura: 'active',
  strongCount: 17,
  pieceCount: 23,
  lost: ['L', 'L', 'T'],
  promotionSlots: [{ piece: 'templar', file: 3 }],
  material: 81.0
}

export const moveLog: LoggedTurn[] = [
  { number: 1, white: 'd3-d7', black: 'i11-i7' },
  { number: 2, white: 'Mh1-h5', black: 'Mm13-i9' },
  { number: 3, white: 'Sa1-a4', black: 'Th13-i11' },
  { number: 4, white: 'j3-j7', black: 'Gj11xj7' },
  { number: 5, white: 'Hc1-f4', black: 'Mi9-g7' },
  { number: 6, white: 'Ge1-e3', black: 'd11-d7' },
  { number: 7, white: 'Ta1-c2', black: 'Sm13-m9' },
  { number: 8, white: 'Ab1-b5', black: 'Hk13-h10' },
  { number: 9, white: 'Sa4-e4', black: 'f11-f7' },
  { number: 10, white: 'Ee1-e5', black: 'Ac13-c9' },
  { number: 11, white: 'Hf4-i7', black: 'Sm9-m5' },
  { number: 12, white: 'Mh5-h8', black: null }
]

export const counters: GameCounters = {
  repetition: 1,
  repetitionLimit: 3,
  noProgress: 14,
  noProgressLimit: 84
}

/** The swap rule is offered on black's first turn only. */
export const swapAvailable = false

/**
 * The back rank, read from file a to file m: `S T H G A E P M A G H T S`. The
 * layout is a palindrome, so one array serves both sides.
 */
const BACK_RANK: PieceName[] = [
  'sentinel',
  'templar',
  'herald',
  'mage',
  'assassin',
  'emperor',
  'pope',
  'marshal',
  'assassin',
  'mage',
  'herald',
  'templar',
  'sentinel'
]

function army(side: Side, backRank: number, legionaryRank: number): Position {
  const squares: Position = {}
  BACK_RANK.forEach((type, index) => {
    const file = FILES[index]
    squares[`${file}${backRank}`] = { side, type }
    squares[`${file}${legionaryRank}`] = { side, type: 'legionary' }
  })
  return squares
}

/**
 * The opening setup. White holds ranks 1 and 3 at the bottom of the board, black
 * holds ranks 13 and 11 at the top, and ranks 2 and 12 stay empty.
 */
export const position: Position = {
  ...army('white', 1, 3),
  ...army('black', 13, 11)
}