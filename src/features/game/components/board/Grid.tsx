import type { ReactNode } from 'react'
import type { Move, Position, Result } from '@/types/game'
import { useState, useRef, useEffect } from 'react'
import { FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { POPE } from '@/constants/piece'
import { CHECKMATE } from '@/constants/outcome'
import { COORDS, SQUARE, BOARD, PATTERN, FONT_SIZE, BASELINE } from '@/constants/style'
import { Pieces } from './Pieces'
import { Highlights } from './Highlights'
import { squareFromEvent, remapIds, translate, markColour } from '../../lib/view'
import { cn } from '@/lib/cn'

type GridProps = {
  position: Position
  lastMove: Move | null
  selected: string | null
  targets: string[]
  marks: Record<string, string>
  arrows: Record<string, string>
  isFlipped: boolean
  result: Result | null
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
  onArrow: (from: string, to: string, colour: string) => void
}
function Files({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateColumns: `repeat(13, ${SQUARE})` }}>
      {(isFlipped ? FILES.toReversed() : FILES).map(file => (
        <span key={file} className='flex justify-center pt-2'>
          {file}
        </span>
      ))}
    </div>
  )
}
function Ranks({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateRows: `repeat(13, ${SQUARE})` }}>
      {(isFlipped ? RANKS : RANKS.toReversed()).map(rank => (
        <span key={rank} className='flex items-center justify-end pr-2'>
          {rank}
        </span>
      ))}
    </div>
  )
}
function Squares({
  isFlipped,
  onSelect,
  onMark,
  onArrow,
  children
}: {
  isFlipped: boolean
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
  onArrow: (from: string, to: string, colour: string) => void
  children: ReactNode
}) {
  const pressed = useRef<string | null>(null)
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
      onMouseDown={event => {
        if (event.button === 2) pressed.current = squareFromEvent(event, isFlipped)
      }}
      onMouseUp={event => {
        const from = pressed.current
        pressed.current = null
        if (event.button !== 2 || from === null) return
        const to = squareFromEvent(event, isFlipped)
        if (from === to) onMark(to, markColour(event))
        else onArrow(from, to, markColour(event))
      }}>
      {children}
    </div>
  )
}
function CommandSquare({ isOccupied }: { isOccupied: boolean }) {
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
function Layers({
  position,
  lastMove,
  selected,
  targets,
  marks,
  arrows,
  ids,
  snap,
  isFlipped,
  isAnimated,
  result,
  onSelect,
  onMark,
  onArrow
}: GridProps & { ids: Map<string, number>; snap: Move | null; isAnimated: boolean }) {
  const { pieces, occupancy, side, checkers, enhanced } = position
  const check = checkers.length === 0 ? null : pieces[side][POPE][0]!
  return (
    <Squares isFlipped={isFlipped} onSelect={onSelect} onMark={onMark} onArrow={onArrow}>
      <CommandSquare isOccupied={occupancy[COMMAND_SQUARE] !== undefined} />
      <Highlights
        lastMove={lastMove}
        check={check}
        selected={selected}
        targets={targets}
        occupancy={occupancy}
        marks={marks}
        arrows={arrows}
        isFlipped={isFlipped}
      />
      <Pieces
        occupancy={occupancy}
        ids={ids}
        snap={snap}
        enhanced={enhanced}
        isFlipped={isFlipped}
        isAnimated={isAnimated}
        fallen={result?.reason === CHECKMATE ? check : null}
      />
    </Squares>
  )
}
export function Grid({ lastMove, isFlipped, ...rest }: GridProps) {
  const { occupancy } = rest.position
  const [prev, setPrev] = useState({ move: lastMove, occupancy })
  const [keys, setKeys] = useState(() => remapIds(new Map<string, number>(), occupancy, null, 0))
  const [snap, setSnap] = useState<Move | null>(null)
  const [orientation, setOrientation] = useState({ flipped: isFlipped, immediate: false })
  if (prev.move !== lastMove || prev.occupancy !== occupancy) {
    const played = prev.move === lastMove ? null : lastMove
    setPrev({ move: lastMove, occupancy })
    setKeys(current => remapIds(current.ids, occupancy, played, current.lastId))
    setSnap(played)
  }
  if (orientation.flipped !== isFlipped) setOrientation({ flipped: isFlipped, immediate: true })
  useEffect(() => {
    const settled = snap === null && !orientation.immediate
    const frame = settled
      ? null
      : requestAnimationFrame(() => {
          setSnap(null)
          setOrientation(current => ({ ...current, immediate: false }))
        })
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [snap, orientation.immediate])
  return (
    <div className='@container w-full select-none overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `${COORDS} auto`, gridTemplateRows: `auto ${COORDS}` }}>
        <Ranks isFlipped={isFlipped} />
        <Layers
          {...rest}
          lastMove={lastMove}
          ids={keys.ids}
          snap={snap}
          isFlipped={isFlipped}
          isAnimated={snap === null && !orientation.immediate}
        />
        <div />
        <Files isFlipped={isFlipped} />
      </div>
    </div>
  )
}