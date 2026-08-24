import type { ReactNode } from 'react'

export function InfoHint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type='button'
      aria-label={label}
      className='group relative inline-grid h-3.5 w-3.5 cursor-help select-none place-items-center rounded-full border border-line-strong bg-bg pt-0.75 font-sans text-[8px] leading-none text-ink-faint transition-colors hover:text-ink'>
      i
      <span
        role='tooltip'
        className='pointer-events-none absolute right-0 top-5 z-20 hidden w-56 rounded border border-line bg-surface px-2 py-1.5 text-left font-notation text-[11px] font-normal normal-case leading-snug tracking-normal text-ink-dim group-hover:block group-focus-visible:block'>
        {children}
      </span>
    </button>
  )
}