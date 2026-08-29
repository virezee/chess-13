import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Zone({ isEnhanced, children }: { isEnhanced: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded border px-3.5 py-3',
        isEnhanced ? 'border-good/60 bg-good/10' : 'border-alert/60 bg-alert/10'
      )}>
      <p
        className={cn(
          'text-[10px] font-semibold uppercase tracking-[0.16em]',
          isEnhanced ? 'text-good' : 'text-alert'
        )}>
        {isEnhanced ? 'Enhanced' : 'Restricted'}
      </p>
      {children}
    </div>
  )
}