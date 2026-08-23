'use client'

import { AUTO, FIXED } from '@/constants/display'
import { IconButton } from './ui/IconButton'
import { useFlip, setFlip } from '@/lib/flip'
import { cn } from '@/lib/cn'

export function FlipToggle() {
  const isAuto = useFlip() === AUTO
  return (
    <IconButton
      label={isAuto ? 'Auto Flip On' : 'Auto Flip Off'}
      onClick={() => setFlip(isAuto ? FIXED : AUTO)}>
      <span
        className={cn(
          'h-4 w-4 bg-current [mask:url(/flip.svg)_center/contain_no-repeat]',
          isAuto && 'text-brass'
        )}
      />
    </IconButton>
  )
}