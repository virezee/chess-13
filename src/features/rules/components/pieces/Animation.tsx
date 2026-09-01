'use client'

import type { Move, Trace } from '@/types/game'
import type { BoardPiece } from '../../types/setup'
import { useState, useEffect } from 'react'
import { LOOP } from '../../constants/scene'
import { Diagram } from '../Diagram'
import { place } from '../../lib/occupant'

export function Animation({
  caption,
  subject,
  pieces,
  move,
  trace
}: {
  caption: string
  subject: string
  pieces: BoardPiece[]
  move: Move
  trace: Trace[] | null
}) {
  const [isPlayed, setPlayed] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setPlayed(!isPlayed), isPlayed ? LOOP.duration : LOOP.delay)
    return () => clearTimeout(timer)
  }, [isPlayed])
  return (
    <div className='rounded border border-line px-3.5 py-3'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
        {caption}
      </p>
      <Diagram
        subject={subject}
        pieces={pieces
          .filter(occupant => !isPlayed || !move.captures?.includes(occupant.square))
          .map(occupant =>
            isPlayed && occupant.square === move.from
              ? place(occupant.side, occupant.piece, move.to, occupant.isEnhanced)
              : occupant
          )}
        moves={null}
        captures={null}
        trace={isPlayed && trace !== null ? trace : undefined}
        isAnimated={isPlayed}
      />
    </div>
  )
}