import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export function IconButton({
  label,
  href,
  onClick,
  children
}: {
  label: string
  href?: string
  onClick?: () => void
  children: ReactNode
}) {
  const style = cn(
    'group relative grid h-8 w-8 cursor-pointer place-items-center rounded border border-transparent text-ink-faint',
    'transition-colors hover:border-line hover:bg-surface hover:text-ink'
  )
  const tooltip = (
    <span
      role='tooltip'
      className='pointer-events-none absolute right-0 top-9 z-20 hidden whitespace-nowrap rounded border border-line bg-surface px-2 py-1 font-notation text-[11px] leading-snug text-ink-dim group-hover:block group-focus-visible:block'>
      {label}
    </span>
  )
  if (href !== undefined)
    return (
      <Link href={href} aria-label={label} className={style}>
        {children}
        {tooltip}
      </Link>
    )
  return (
    <button type='button' onClick={onClick} aria-label={label} className={style}>
      {children}
      {tooltip}
    </button>
  )
}