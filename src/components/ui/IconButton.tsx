import { cn } from '@/lib/cn'

export function IconButton({
  label,
  onClick,
  children
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-8 w-8 place-items-center rounded border border-transparent text-ink-faint',
        'transition-colors hover:border-line hover:bg-surface hover:text-ink'
      )}>
      {children}
    </button>
  )
}