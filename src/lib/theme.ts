import { DARK, LIGHT } from '@/constants/display'

const applyStoredTheme = (): void => {
  try {
    const stored = localStorage.getItem('theme')
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    document.documentElement.dataset['theme'] = stored ?? (prefersLight ? LIGHT : DARK)
  } catch {
    document.documentElement.dataset['theme'] = DARK
  }
}
export const theme = `(${applyStoredTheme.toString()})()`