import type { Save } from '@/types/game'
import { DATA } from '@/constants/storage'

export const readSave = (): Save | null => {
  const stored = window.localStorage.getItem(DATA)
  if (stored === null) return null
  try {
    return JSON.parse(stored) as Save
  } catch {
    clearSave()
    return null
  }
}
export const writeSave = (save: Save): void =>
  window.localStorage.setItem(DATA, JSON.stringify(save))
export const clearSave = (): void => window.localStorage.removeItem(DATA)