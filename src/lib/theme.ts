const applyStoredTheme = (): void => {
  try {
    const stored = localStorage.getItem('theme')
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    document.documentElement.dataset.theme = stored ?? (prefersLight ? 'light' : 'dark')
  } catch {
    document.documentElement.dataset.theme = 'dark'
  }
}
export const themeScript = `(${applyStoredTheme.toString()})()`