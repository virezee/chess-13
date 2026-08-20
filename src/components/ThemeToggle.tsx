'use client'

import { useTheme } from 'next-themes'
import { IconButton } from './ui/IconButton'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <IconButton label='Switch Theme' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <span className='h-4 w-4 bg-current [mask:url(/light.svg)_center/contain_no-repeat] light:hidden' />
      <span className='hidden h-4 w-4 bg-current [mask:url(/dark.svg)_center/contain_no-repeat] light:block' />
    </IconButton>
  )
}