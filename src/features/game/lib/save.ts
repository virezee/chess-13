import type { Save } from '@/types/game'
import { DATA } from '@/constants/storage'
import { opening } from '../engine/turn'

const hasKeys = (value: unknown, shape: object): boolean =>
  typeof value === 'object' && value !== null && Object.keys(shape).every(key => key in value)
const isSave = (value: unknown): value is Save => {
  const shape = opening()
  if (!hasKeys(value, shape)) return false
  const save = value as Save
  return hasKeys(save.state, shape.state) && hasKeys(save.match, shape.match)
}
const parse = (stored: string): unknown => {
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}
export const readSave = (): Save | null => {
  const stored = window.localStorage.getItem(DATA)
  if (stored === null) return null
  const parsed = parse(stored)
  if (isSave(parsed)) return parsed
  clearSave()
  return null
}
export const writeSave = (save: Save): void =>
  window.localStorage.setItem(DATA, JSON.stringify(save))
export const clearSave = (): void => window.localStorage.removeItem(DATA)