import type { PieceName, Side } from '@/types/material'
import type { Castling, CastlingSide } from '@/types/game'
import type { ENHANCED, RESTRICTED } from './zone'
import { SIZE } from './board'
import { LEAP_3_2, LEAP_2_1 } from './direction'

type Zone = typeof ENHANCED | typeof RESTRICTED
export const POPE = 'pope'
export const EMPEROR = 'emperor'
export const MARSHAL = 'marshal'
export const ASSASSIN = 'assassin'
export const SENTINEL = 'sentinel'
export const MAGE = 'mage'
export const HERALD = 'herald'
export const TEMPLAR = 'templar'
export const LEGIONARY = 'legionary'
export const REACH = {
  assassin: {
    restricted: { reach: 6 },
    enhanced: { reach: SIZE }
  },
  sentinel: {
    restricted: { quiet: 3, capture: 6 },
    enhanced: { quiet: 6, capture: SIZE }
  },
  herald: {
    restricted: { diagonal: 6 },
    enhanced: { diagonal: SIZE }
  },
  legionary: {
    restricted: { quiet: 1 },
    enhanced: { quiet: 2 }
  }
} as const satisfies Partial<Record<PieceName, Record<Zone, object>>>
export const LEAP = {
  templar: { restricted: LEAP_3_2, enhanced: [...LEAP_3_2, ...LEAP_2_1] }
} as const satisfies Partial<
  Record<PieceName, Record<Zone, readonly (readonly [number, number])[]>>
>
export const CASTLING = {
  white: {
    home: 'g1',
    left: { to: 'd1', sentinel: 'a1', sentinelTo: 'e1', between: ['b1', 'c1', 'd1', 'e1', 'f1'] },
    right: { to: 'j1', sentinel: 'm1', sentinelTo: 'i1', between: ['h1', 'i1', 'j1', 'k1', 'l1'] }
  },
  black: {
    home: 'g13',
    left: {
      to: 'd13',
      sentinel: 'a13',
      sentinelTo: 'e13',
      between: ['b13', 'c13', 'd13', 'e13', 'f13']
    },
    right: {
      to: 'j13',
      sentinel: 'm13',
      sentinelTo: 'i13',
      between: ['h13', 'i13', 'j13', 'k13', 'l13']
    }
  }
} as const satisfies Record<Side, { home: string } & Record<keyof CastlingSide, Castling>>
export const BACK_RANK = [
  SENTINEL,
  TEMPLAR,
  HERALD,
  MAGE,
  ASSASSIN,
  EMPEROR,
  POPE,
  MARSHAL,
  ASSASSIN,
  MAGE,
  HERALD,
  TEMPLAR,
  SENTINEL
] as const satisfies readonly PieceName[]
export const LETTER: Record<PieceName, string> = {
  [POPE]: 'P',
  [EMPEROR]: 'E',
  [MARSHAL]: 'M',
  [ASSASSIN]: 'A',
  [SENTINEL]: 'S',
  [MAGE]: 'G',
  [HERALD]: 'H',
  [TEMPLAR]: 'T',
  [LEGIONARY]: 'L'
} as const satisfies Record<PieceName, string>
export const CLASSIC_LETTER: Record<PieceName, string> = {
  [POPE]: 'K',
  [EMPEROR]: 'Q',
  [MARSHAL]: 'M',
  [ASSASSIN]: 'A',
  [SENTINEL]: 'R',
  [MAGE]: 'G',
  [HERALD]: 'B',
  [TEMPLAR]: 'N',
  [LEGIONARY]: 'P'
} as const satisfies Record<PieceName, string>
export const CLASSIC_PLY: Record<string, string> = Object.fromEntries(
  Object.entries(LETTER).map(([name, letter]) => [letter, CLASSIC_LETTER[name as PieceName]])
)
export const VALUE = {
  pope: { enhanced: Infinity, restricted: Infinity },
  emperor: { enhanced: 15, restricted: 15 },
  marshal: { enhanced: 13, restricted: 13 },
  assassin: { enhanced: 10, restricted: 7 },
  sentinel: { enhanced: 9, restricted: 6 },
  mage: { enhanced: 8, restricted: 5 },
  herald: { enhanced: 7, restricted: 5 },
  templar: { enhanced: 7, restricted: 5 },
  legionary: { enhanced: 2, restricted: 2 }
} as const satisfies Record<PieceName, Record<Zone, number>>