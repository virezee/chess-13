import { useSyncExternalStore } from 'react'

export const setting = <T extends string>(
  key: string,
  fallback: T
): { use: () => T; set: (value: T) => void } => {
  const subscribe = (onChange: () => void): (() => void) => {
    window.addEventListener(key, onChange)
    return () => window.removeEventListener(key, onChange)
  }
  return {
    use: (): T =>
      useSyncExternalStore(
        subscribe,
        (): T => (localStorage.getItem(key) as T | null) ?? fallback,
        (): T => fallback
      ),
    set: (value: T): void => {
      localStorage.setItem(key, value)
      window.dispatchEvent(new Event(key))
    }
  }
}