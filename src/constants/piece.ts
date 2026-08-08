import { SIZE } from './board'
import { LEAP_3_2, LEAP_2_1 } from './direction'

export const REACH = {
  legionary: {
    restricted: { quiet: 1 },
    enhanced: { quiet: 2 }
  },
  herald: {
    restricted: { diagonal: 6 },
    enhanced: { diagonal: SIZE }
  },
  sentinel: {
    restricted: { quiet: 3, capture: 6 },
    enhanced: { quiet: 6, capture: SIZE }
  }
} as const
export const LEAP = {
  templar: { restricted: LEAP_3_2, enhanced: [...LEAP_3_2, ...LEAP_2_1] }
} as const