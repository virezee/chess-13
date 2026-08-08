import { SIZE } from './board'

export const REACH = {
  sentinel: {
    restricted: { quiet: 3, capture: 6 },
    enhanced: { quiet: 6, capture: SIZE }
  }
} as const