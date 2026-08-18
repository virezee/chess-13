import { cn } from '@/lib/cn'

export function IconButton({
  children,
  label,
  onClick
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
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