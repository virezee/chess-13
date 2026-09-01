import type { State } from '@/types/game'
import { WHITE, BLACK } from '@/constants/player'
import {
  POPE,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY
} from '@/constants/piece'
import { position } from '@/features/game/engine/position'
import { riposteFlag } from '@/features/game/lib/trace'
import { place } from '../lib/occupant'

const RIPOSTE_STATE: State = {
  awake: { [WHITE]: false, [BLACK]: false },
  riposte: true,
  castlingSide: {
    [WHITE]: { left: false, right: false },
    [BLACK]: { left: false, right: false }
  },
  promotions: { [WHITE]: [], [BLACK]: [] },
  enPassant: null,
  noProgress: { count: 0, limit: 0 }
}
export const BLAST = [
  place(BLACK, SENTINEL, 'e8', false),
  place(BLACK, HERALD, 'e7', false),
  place(BLACK, LEGIONARY, 'f6', false),
  place(BLACK, TEMPLAR, 'g6', false)
]
export const ASSASSIN_CAPTURES = [
  place(BLACK, SENTINEL, 'c8', false),
  place(BLACK, TEMPLAR, 'i9', false),
  place(BLACK, HERALD, 'm3', false)
]
export const ASSASSIN_OCCUPIED = [
  place(BLACK, SENTINEL, 'c7', false),
  place(BLACK, HERALD, 'c8', false),
  place(BLACK, LEGIONARY, 'g3', false),
  place(WHITE, TEMPLAR, 'h3', false)
]
export const ASSASSIN_ATTACKED = [
  place(BLACK, SENTINEL, 'c7', false),
  place(BLACK, HERALD, 'e6', false)
]
export const LOOP = { duration: 1000, delay: 200 }
export const RIPOSTE_FLAG = riposteFlag(
  position(
    WHITE,
    {
      b1: { side: WHITE, piece: POPE },
      g5: { side: WHITE, piece: MARSHAL },
      l10: { side: BLACK, piece: SENTINEL },
      m13: { side: BLACK, piece: POPE }
    },
    RIPOSTE_STATE
  )
)
export const RIPOSTE_BLAST = riposteFlag(
  position(
    WHITE,
    {
      a1: { side: WHITE, piece: POPE },
      m7: { side: WHITE, piece: MARSHAL },
      c7: { side: BLACK, piece: MAGE },
      a13: { side: BLACK, piece: POPE }
    },
    RIPOSTE_STATE
  )
)
export const RIPOSTE_EN_PRISE = riposteFlag(
  position(
    WHITE,
    {
      b1: { side: WHITE, piece: POPE },
      g7: { side: WHITE, piece: MARSHAL },
      g9: { side: BLACK, piece: ASSASSIN },
      a12: { side: BLACK, piece: POPE }
    },
    RIPOSTE_STATE
  )
)