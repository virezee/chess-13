import type { Mode } from '@/types/settings'
import { useSyncExternalStore } from 'react'
import { MODE } from '@/constants/storage'
import { NATIVE } from '@/constants/display'

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener(MODE, onChange)
  return () => window.removeEventListener(MODE, onChange)
}
export const useMode = (): Mode =>
  useSyncExternalStore(
    subscribe,
    (): Mode => (localStorage.getItem(MODE) as Mode | null) ?? NATIVE,
    (): Mode => NATIVE
  )
export const setMode = (mode: Mode): void => {
  localStorage.setItem(MODE, mode)
  window.dispatchEvent(new Event(MODE))
}