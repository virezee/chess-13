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