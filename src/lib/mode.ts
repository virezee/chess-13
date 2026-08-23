import type { Mode } from '@/types/settings'
import { MODE } from '@/constants/storage'
import { NATIVE } from '@/constants/display'
import { setting } from './setting'

export const { use: useMode, set: setMode } = setting<Mode>(MODE, NATIVE)