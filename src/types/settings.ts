import type { DARK, LIGHT, AUTO, FIXED, NATIVE, CLASSIC } from '@/constants/display'

export type Theme = typeof DARK | typeof LIGHT
export type Flip = typeof AUTO | typeof FIXED
export type Mode = typeof NATIVE | typeof CLASSIC