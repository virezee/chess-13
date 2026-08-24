import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function IconButton({
  label,
  onClick,
  children
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group relative grid h-8 w-8 cursor-pointer place-items-center rounded border border-transparent text-ink-faint',
        'transition-colors hover:border-line hover:bg-surface hover:text-ink'
      )}>
      {children}
      <span
        role='tooltip'
        className='pointer-events-none absolute right-0 top-9 z-20 hidden whitespace-nowrap rounded border border-line bg-surface px-2 py-1 font-notation text-[11px] leading-snug text-ink-dim group-hover:block group-focus-visible:block'>
        {label}
      </span>
    </button>
  )
}