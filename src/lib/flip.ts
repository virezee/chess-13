import type { Flip } from '@/types/settings'
import { FLIP } from '@/constants/storage'
import { AUTO } from '@/constants/display'
import { setting } from './setting'

export const { use: useFlip, set: setFlip } = setting<Flip>(FLIP, AUTO)