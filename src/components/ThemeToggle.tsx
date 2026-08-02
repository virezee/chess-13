'use client'

import { THEME_STORAGE_KEY } from '@/lib/theme'

function toggle() {
  const root = document.documentElement
  const next = root.dataset.theme === 'light' ? 'dark' : 'light'
  root.dataset.theme = next
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch (e) {
    console.warn('Theme preference could not be saved.', e)
  }
}
export function ThemeToggle() {
  return (
    <button
      type='button'
      onClick={toggle}
      aria-label='Switch between light and dark theme'
      title='Switch theme'
      className='grid h-8 w-8 place-items-center rounded border border-transparent text-ink-faint transition-colors hover:border-line hover:bg-surface hover:text-ink'>
      <svg viewBox='0 0 16 16' className='h-4 w-4 light:hidden' aria-hidden>
        <circle cx='8' cy='8' r='3' fill='none' stroke='currentColor' strokeWidth='1.1' />
        <path
          d='M8 1.4v1.6M8 13v1.6M14.6 8H13M3 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4 3.3 3.3'
          stroke='currentColor'
          strokeWidth='1.1'
          strokeLinecap='round'
        />
      </svg>
      <svg viewBox='0 0 16 16' className='hidden h-4 w-4 light:block' aria-hidden>
        <path
          d='M13.2 9.7A5.6 5.6 0 0 1 6.3 2.8a5.6 5.6 0 1 0 6.9 6.9'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.1'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  )
}