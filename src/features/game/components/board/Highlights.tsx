import type { SquareOccupant } from '@/types/material'
import type { Move, Trace } from '@/types/game'
import { SIZE } from '@/constants/board'
import { SELECTED, DEST, DEST_CAPTURE, LAST, CHECK, STAGGER } from '@/constants/style'
import { translate } from '../../lib/layout'
import { arrowPoints } from '../../lib/annotation'
import { cn } from '@/lib/cn'

function Fill({
  square,
  backgroundColour,
  isFlipped,
  isInteractive
}: {
  square: string
  backgroundColour: string
  isFlipped: boolean
  isInteractive?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0',
        isInteractive ? 'cursor-pointer' : 'pointer-events-none'
      )}
      style={{
        ...translate(square, isFlipped),
        background: backgroundColour,
        zIndex: isInteractive ? 3 : undefined
      }}
    />
  )
}
function LastMove({ move, isFlipped }: { move: Move; isFlipped: boolean }) {
  return [...new Set([move.from, move.to])].map(square => (
    <Fill key={square} square={square} backgroundColour={LAST} isFlipped={isFlipped} />
  ))
}
function Arrows({ arrows, isFlipped }: { arrows: Record<string, string>; isFlipped: boolean }) {
  const drawn = Object.entries(arrows)
  if (drawn.length === 0) return null
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className='pointer-events-none absolute inset-0'
      style={{ zIndex: 2 }}
      aria-hidden>
      {drawn.map(([step, colour]) => {
        const [from, to] = step.split('-')
        return (
          <polygon
            key={step}
            points={arrowPoints({ from: from!, to: to! }, isFlipped)}
            fill={colour}
          />
        )
      })}
    </svg>
  )
}
function Path({ trace, isFlipped }: { trace: Trace[]; isFlipped: boolean }) {
  const unique = new Map(
    trace.map(entry => [`${entry.square}-${entry.delay}-${entry.colour}`, entry])
  )
  return [...unique].map(([key, { square, delay, colour }]) => (
    <div
      key={key}
      className='pointer-events-none absolute left-0 top-0'
      style={{
        ...translate(square, isFlipped),
        background: colour,
        animation: `chase ${STAGGER.duration}ms ease-out ${delay}ms both`
      }}
    />
  ))
}
export function Highlights({
  lastMove,
  check,
  selected,
  targets,
  occupancy,
  marks,
  arrows,
  trace,
  isFlipped
}: {
  lastMove: Move | null
  check: string | null
  selected: string | null
  targets: string[]
  occupancy: SquareOccupant
  marks: Record<string, string>
  arrows: Record<string, string>
  trace: Trace[]
  isFlipped: boolean
}) {
  return (
    <>
      {lastMove !== null && <LastMove move={lastMove} isFlipped={isFlipped} />}
      {check !== null && <Fill square={check} backgroundColour={CHECK} isFlipped={isFlipped} />}
      {Object.entries(marks).map(([square, colour]) => (
        <Fill key={square} square={square} backgroundColour={colour} isFlipped={isFlipped} />
      ))}
      {selected !== null && (
        <Fill square={selected} backgroundColour={SELECTED} isFlipped={isFlipped} />
      )}
      {targets.map(square => (
        <Fill
          key={square}
          square={square}
          backgroundColour={occupancy[square] ? DEST_CAPTURE : DEST}
          isFlipped={isFlipped}
          isInteractive
        />
      ))}
      <Arrows arrows={arrows} isFlipped={isFlipped} />
      <Path trace={trace} isFlipped={isFlipped} />
    </>
  )
}