/**
 * Runs in the document head before the first paint, so the page never renders
 * in one theme and then jumps to the other on hydration.
 *
 * This function is serialised with `toString()` and injected as raw text, so it
 * has to stay self-contained. Only the body survives, not the closure, so
 * anything it reaches for from module scope is undefined at runtime. That is
 * why the storage key is written out literally here instead of using
 * THEME_STORAGE_KEY.
 */
function applyStoredTheme() {
  try {
    const stored = localStorage.getItem('theme')
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    document.documentElement.dataset.theme = stored ?? (prefersLight ? 'light' : 'dark')
  } catch {
    document.documentElement.dataset.theme = 'dark'
  }
}
export const themeScript = `(${applyStoredTheme.toString()})()`