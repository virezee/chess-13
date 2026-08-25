'use client'

import { NATIVE, CLASSIC } from '@/constants/display'
import { InfoHint } from './ui/InfoHint'
import { useMode, setMode } from '@/lib/mode'
import { cn } from '@/lib/cn'

export function PieceSetToggle() {
  const isNative = useMode() === NATIVE
  return (
    <div className='relative mr-6 flex'>
      <button
        type='button'
        role='switch'
        aria-checked={isNative}
        aria-label='Piece set'
        onClick={() => setMode(isNative ? CLASSIC : NATIVE)}
        className='relative h-8 w-22 cursor-pointer rounded-full border border-line bg-surface text-[9px] font-semibold uppercase tracking-[0.12em]'>
        <span
          aria-hidden
          className={cn(
            'absolute left-1 top-1 h-6 w-6 rounded-full transition duration-200 ease-out',
            isNative ? 'translate-x-14 bg-brass' : 'bg-line-strong'
          )}
        />
        <span
          className={cn(
            'absolute inset-y-0 left-7 right-1 flex items-center justify-center pt-px text-ink-dim',
            'transition-opacity duration-200',
            isNative && 'opacity-0'
          )}>
          Classic
        </span>
        <span
          className={cn(
            'absolute inset-y-0 left-1 right-7 flex items-center justify-center pt-px text-ink-dim',
            'transition-opacity duration-200',
            !isNative && 'opacity-0'
          )}>
          Native
        </span>
      </button>
      <span className='absolute -right-3 -top-3'>
        <InfoHint label='About piece set'>
          Switches piece images and notation letters between classic chess and the native set. Rules
          and play stay the same.
        </InfoHint>
      </span>
    </div>
  )
}