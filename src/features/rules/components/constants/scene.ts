import { WHITE, BLACK } from '@/constants/player'
import { SENTINEL, HERALD, TEMPLAR, LEGIONARY } from '@/constants/piece'
import { place } from '../../lib/occupant'

export const BLAST = [
  place(WHITE, LEGIONARY, 'g8', true),
  place(BLACK, SENTINEL, 'e8', false),
  place(BLACK, HERALD, 'e7', false),
  place(BLACK, LEGIONARY, 'f6', false),
  place(BLACK, TEMPLAR, 'g6', false)
]