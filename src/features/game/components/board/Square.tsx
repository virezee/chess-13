import type { ReactNode } from 'react'
import type { SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { COMMAND_SQUARE } from '@/constants/board'
import {
  SQUARE,
  BOARD,
  PATTERN,
  FONT_SIZE,
  BASELINE,
  SELECTED,
  DEST,
  DEST_CAPTURE,
  LAST,
  CHECK
} from '@/constants/style'
import { squareFromEvent, translate, markColour } from '../../lib/view'
import { cn } from '@/lib/cn'

function Highlight({
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
    <Highlight key={square} square={square} backgroundColour={LAST} isFlipped={isFlipped} />
  ))
}
export function CommandSquare({ isOccupied }: { isOccupied: boolean }) {
  return (
    <div
      className='pointer-events-none absolute left-0 top-0 select-none bg-square-command'
      style={translate(COMMAND_SQUARE, false)}>
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid meet'
        className={cn('h-full w-full', isOccupied ? 'opacity-25' : 'opacity-70')}
        aria-hidden>
        <text
          x='50'
          y={BASELINE}
          textAnchor='middle'
          fontSize={FONT_SIZE}
          className='fill-square-command-ink font-command'>
          M
        </text>
      </svg>
    </div>
  )
}
export function Surface({
  isFlipped,
  onSelect,
  onMark,
  children
}: {
  isFlipped: boolean
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
  children: ReactNode
}) {
  return (
    <div
      className='relative overflow-hidden rounded-[3px] outline outline-square-edge'
      style={{
        width: BOARD,
        height: BOARD,
        backgroundImage: PATTERN,
        backgroundSize: `calc(2 * ${SQUARE}) calc(2 * ${SQUARE})`
      }}
      onClick={event => onSelect(squareFromEvent(event, isFlipped))}
      onContextMenu={event => {
        event.preventDefault()
        onMark(squareFromEvent(event, isFlipped), markColour(event))
      }}>
      {children}
    </div>
  )
}
export function Overlay({
  lastMove,
  check,
  selected,
  marks,
  isFlipped
}: {
  lastMove: Move | null
  check: string | null
  selected: string | null
  marks: Record<string, string>
  isFlipped: boolean
}) {
  return (
    <>
      {lastMove !== null && <LastMove move={lastMove} isFlipped={isFlipped} />}
      {check !== null && (
        <Highlight square={check} backgroundColour={CHECK} isFlipped={isFlipped} />
      )}
      {Object.entries(marks).map(([square, colour]) => (
        <Highlight key={square} square={square} backgroundColour={colour} isFlipped={isFlipped} />
      ))}
      {selected !== null && (
        <Highlight square={selected} backgroundColour={SELECTED} isFlipped={isFlipped} />
      )}
    </>
  )
}
export function Destinations({
  occupancy,
  targets,
  isFlipped
}: {
  occupancy: SquareOccupant
  targets: string[]
  isFlipped: boolean
}) {
  return targets.map(square => (
    <Highlight
      key={square}
      square={square}
      backgroundColour={occupancy[square] ? DEST_CAPTURE : DEST}
      isFlipped={isFlipped}
      isInteractive
    />
  ))
}