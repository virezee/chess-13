import { WHITE, BLACK } from '@/constants/player'
import { SENTINEL, HERALD, TEMPLAR, LEGIONARY } from '@/constants/piece'
import { place } from '../../lib/occupant'

export const ASSASSIN_CAPTURES = [
  place(BLACK, SENTINEL, 'c7', false),
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
export const BLAST = [
  place(BLACK, SENTINEL, 'e8', false),
  place(BLACK, HERALD, 'e7', false),
  place(BLACK, LEGIONARY, 'f6', false),
  place(BLACK, TEMPLAR, 'g6', false)
]