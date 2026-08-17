import type { PieceName } from '@/types/material'
import { SIZE } from './board'
import { LEAP_3_2, LEAP_2_1 } from './direction'

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
} as const
export const LEAP = {
  templar: { restricted: LEAP_3_2, enhanced: [...LEAP_3_2, ...LEAP_2_1] }
} as const
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
} as const
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