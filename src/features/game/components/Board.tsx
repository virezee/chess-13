import type { MouseEvent, CSSProperties } from 'react'
import type { Piece, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { useState } from 'react'
import Image from 'next/image'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { parseSquare, makeSquare } from '../lib/coordinate'
import { cn } from '@/lib/cn'

const COORDS = 'var(--coords-width)'
const SQUARE = 'var(--square-size)'
const BOARD = 'var(--board-size)'
const PATTERN = 'var(--board-pattern)'
const CAP_HEIGHT = 0.7
const FONT_SIZE = 80
const BASELINE = 50 + (FONT_SIZE * CAP_HEIGHT) / 2
const SELECTED = 'var(--square-selected)'
const DEST = 'var(--move-dest)'
const DEST_CAPTURE = 'var(--move-dest-capture)'
const MARKS = {
  red: 'var(--mark-red)',
  yellow: 'var(--mark-yellow)',
  green: 'var(--mark-green)',
  blue: 'var(--mark-blue)'
} as const
const squareFromEvent = (event: MouseEvent<HTMLDivElement>): string => {
  const box = event.currentTarget.getBoundingClientRect()
  const file = Math.min(SIZE - 1, Math.floor(((event.clientX - box.left) / box.width) * SIZE))
  const rank =
    SIZE - Math.min(SIZE - 1, Math.floor(((event.clientY - box.top) / box.height) * SIZE))
  return makeSquare({ file, rank })
}
const remapIds = (
  ids: Map<string, number>,
  occupancy: SquareOccupant,
  move: Move | null,
  lastId: number
): { ids: Map<string, number>; lastId: number } => {
  const next = new Map(ids)
  let id = lastId
  if (move !== null) {
    move.captures?.forEach(square => next.delete(square))
    if (move.sentinel !== undefined) {
      const sentinelId = next.get(move.sentinel.from)
      next.delete(move.sentinel.from)
      if (sentinelId !== undefined) next.set(move.sentinel.to, sentinelId)
    }
    const moverId = next.get(move.from)
    next.delete(move.from)
    if (moverId !== undefined && !move.captures?.includes(move.from)) next.set(move.to, moverId)
  }
  for (const square of Object.keys(occupancy))
    if (!next.has(square)) {
      id += 1
      next.set(square, id)
    }
  for (const square of next.keys()) if (occupancy[square] === undefined) next.delete(square)
  return { ids: next, lastId: id }
}
const translate = (square: string): CSSProperties => {
  const { file, rank } = parseSquare(square)
  return {
    width: SQUARE,
    height: SQUARE,
    transform: `translate(calc(${file} * ${SQUARE}), calc(${SIZE - rank} * ${SQUARE}))`
  }
}
const markColour = (event: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }): string =>
  event.ctrlKey
    ? MARKS.yellow
    : event.shiftKey
      ? MARKS.green
      : event.altKey
        ? MARKS.blue
        : MARKS.red
function Files() {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateColumns: `repeat(13, ${SQUARE})` }}>
      {FILES.map(file => (
        <span key={file} className='flex justify-center pt-2'>
          {file}
        </span>
      ))}
    </div>
  )
}
function Ranks() {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateRows: `repeat(13, ${SQUARE})` }}>
      {RANKS.toReversed().map(rank => (
        <span key={rank} className='flex items-center justify-end pr-2'>
          {rank}
        </span>
      ))}
    </div>
  )
}
function CommandSquare({ isOccupied }: { isOccupied: boolean }) {
  return (
    <div
      className='pointer-events-none absolute left-0 top-0 select-none bg-square-command'
      style={translate(COMMAND_SQUARE)}>
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
function PieceImage({ piece, square }: { piece: Piece; square: string }) {
  return (
    <div
      className='absolute left-0 top-0 cursor-pointer transition-transform duration-300 ease-out'
      style={{ ...translate(square), willChange: 'transform', zIndex: 1 }}>
      <Image
        src={`/${piece.side}/${piece.piece}.png`}
        alt={`${piece.side} ${piece.piece}`}
        fill
        sizes={SQUARE}
        loading='eager'
        draggable={false}
        className='select-none object-contain'
      />
    </div>
  )
}
function Highlight({
  square,
  backgroundColour,
  isInteractive
}: {
  square: string
  backgroundColour: string
  isInteractive?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0',
        isInteractive ? 'cursor-pointer' : 'pointer-events-none'
      )}
      style={{
        ...translate(square),
        background: backgroundColour,
        zIndex: isInteractive ? 3 : undefined
      }}
    />
  )
}
function Destinations({ occupancy, targets }: { occupancy: SquareOccupant; targets: string[] }) {
  return targets.map(square => (
    <Highlight
      key={square}
      square={square}
      backgroundColour={occupancy[square] ? DEST_CAPTURE : DEST}
      isInteractive
    />
  ))
}
function Board({
  occupancy,
  selected,
  targets,
  marks,
  ids,
  onSelect,
  onMark
}: {
  occupancy: SquareOccupant
  selected: string | null
  targets: string[]
  marks: Record<string, string>
  ids: Map<string, number>
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
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
      onClick={event => onSelect(squareFromEvent(event))}
      onContextMenu={event => {
        event.preventDefault()
        onMark(squareFromEvent(event), markColour(event))
      }}>
      <CommandSquare isOccupied={occupancy[COMMAND_SQUARE] !== undefined} />
      {Object.entries(marks).map(([square, colour]) => (
        <Highlight key={square} square={square} backgroundColour={colour} />
      ))}
      {selected !== null && <Highlight square={selected} backgroundColour={SELECTED} />}
      {Object.entries(occupancy)
        .toSorted(([a], [b]) => (ids.get(a) ?? 0) - (ids.get(b) ?? 0))
        .map(([square, piece]) => (
          <PieceImage key={ids.get(square)} square={square} piece={piece} />
        ))}
      <Destinations occupancy={occupancy} targets={targets} />
    </div>
  )
}
export function BoardFrame({
  occupancy,
  lastMove,
  selected,
  targets,
  marks,
  onSelect,
  onMark
}: {
  occupancy: SquareOccupant
  lastMove: Move | null
  selected: string | null
  targets: string[]
  marks: Record<string, string>
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}) {
  const [prev, setPrev] = useState({ move: lastMove, occupancy })
  const [keys, setKeys] = useState(() => remapIds(new Map<string, number>(), occupancy, null, 0))
  if (prev.move !== lastMove || prev.occupancy !== occupancy) {
    const played = prev.move === lastMove ? null : lastMove
    setPrev({ move: lastMove, occupancy })
    setKeys(current => remapIds(current.ids, occupancy, played, current.lastId))
  }
  return (
    <div className='@container w-full overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `${COORDS} auto`, gridTemplateRows: `auto ${COORDS}` }}>
        <Ranks />
        <Board
          occupancy={occupancy}
          selected={selected}
          targets={targets}
          marks={marks}
          ids={keys.ids}
          onSelect={onSelect}
          onMark={onMark}
        />
        <div />
        <Files />
      </div>
    </div>
  )
}