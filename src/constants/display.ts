import type { PieceName } from '@/types/material'
import { POPE, EMPEROR, SENTINEL, HERALD, TEMPLAR, LEGIONARY } from './piece'

export const DARK = 'dark'
export const LIGHT = 'light'
export const AUTO = 'auto'
export const FIXED = 'fixed'
export const NATIVE = 'native'
export const CLASSIC = 'classic'
export const CLASSIC_IMAGE: Partial<Record<PieceName, string>> = {
  [POPE]: 'king.svg',
  [EMPEROR]: 'queen.svg',
  [SENTINEL]: 'rook.svg',
  [HERALD]: 'bishop.svg',
  [TEMPLAR]: 'knight.svg',
  [LEGIONARY]: 'pawn.svg'
}