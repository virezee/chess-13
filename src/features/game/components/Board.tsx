import type { CSSProperties, MouseEvent } from 'react'
import type { Piece, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { useRef } from 'react'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { parseSquare, makeSquare } from '../lib/coordinate'
import { cn } from '@/lib/cn'

const COORDS = 'var(--coords-width)'
const SQUARE = 'var(--square-size)'
const BOARD = 'var(--board-size)'
const PATTERN = 'var(--board-pattern)'
const SELECTED = 'var(--square-selected)'
const DEST = 'var(--move-dest)'
const DEST_CAPTURE = 'var(--move-dest-capture)'
const MARKS = {
  red: 'var(--mark-red)',
  yellow: 'var(--mark-yellow)',
  green: 'var(--mark-green)',
  blue: 'var(--mark-blue)'
} as const
const markColour = (event: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }): string =>
  event.ctrlKey
    ? MARKS.yellow
    : event.shiftKey
      ? MARKS.green
      : event.altKey
        ? MARKS.blue
        : MARKS.red
const at = (square: string): CSSProperties => {
  const { file, rank } = parseSquare(square)
  return {
    width: SQUARE,
    height: SQUARE,
    transform: `translate(calc(${file} * ${SQUARE}), calc(${SIZE - rank} * ${SQUARE}))`
  }
}
const reconcile = (
  ids: Map<string, number>,
  position: SquareOccupant,
  move: Move | null,
  fresh: () => number
): void => {
  if (move !== null) {
    move.captures?.forEach(square => ids.delete(square))
    if (move.sentinel !== undefined) {
      const walking = ids.get(move.sentinel.from)
      ids.delete(move.sentinel.from)
      if (walking !== undefined) ids.set(move.sentinel.to, walking)
    }
    const mover = ids.get(move.from)
    ids.delete(move.from)
    if (mover !== undefined && !move.captures?.includes(move.from)) ids.set(move.to, mover)
  }
  for (const square of Object.keys(position)) if (!ids.has(square)) ids.set(square, fresh())
  for (const square of [...ids.keys()]) if (position[square] === undefined) ids.delete(square)
}

/**
 * The M sits inside an SVG so it scales with the square instead of with a font
 * size. Width is the binding dimension for this glyph, so FONT_SIZE fills the
 * box horizontally, and BASELINE puts the cap exactly halfway down: half of the
 * cap height below the centre line.
 */
const CAP_HEIGHT = 0.7
const FONT_SIZE = 80
const BASELINE = 50 + (FONT_SIZE * CAP_HEIGHT) / 2

function CommandSquare({ dimmed }: { dimmed: boolean }) {
  return (
    <div
      className='pointer-events-none absolute left-0 top-0 select-none bg-square-command'
      style={at(COMMAND_SQUARE)}>
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid meet'
        className={cn('h-full w-full', dimmed ? 'opacity-25' : 'opacity-70')}
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

/**
 * The artwork is a single 480px square per piece, scaled down by the browser to
 * whatever the tile currently measures. Nothing here is tied to a pixel size, so
 * the piece stays sharp at 26px on a phone and at 68px on a desktop.
 */
function Occupant({ piece, square }: { piece: Piece; square: string }) {
  return (
    <div
      className='absolute left-0 top-0 cursor-pointer transition-transform duration-300 ease-out'
      style={{ ...at(square), willChange: 'transform', zIndex: 1 }}>
      <img
        src={`/${piece.side}/${piece.piece}.png`}
        alt={`${piece.side} ${piece.piece}`}
        draggable={false}
        className='h-full w-full select-none object-contain'
      />
    </div>
  )
}

function Wash({ square, colour, lift }: { square: string; colour: string; lift?: boolean }) {
  return (
    <div
      // A destination is drawn over the piece standing there, so the ring reads as a
      // ring around it, and it is the one wash that answers the cursor. A mark and the
      // picked up square are drawn under and answer nothing.
      className={cn('absolute left-0 top-0', lift ? 'cursor-pointer' : 'pointer-events-none')}
      style={{ ...at(square), background: colour, zIndex: lift ? 3 : undefined }}
    />
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
// Which square was hit is read off the pointer, since the tiles are a background and
// there is nothing under the cursor to ask.
const squareAt = (event: MouseEvent<HTMLDivElement>): string => {
  const box = event.currentTarget.getBoundingClientRect()
  const file = Math.min(SIZE - 1, Math.floor(((event.clientX - box.left) / box.width) * SIZE))
  const rank =
    SIZE - Math.min(SIZE - 1, Math.floor(((event.clientY - box.top) / box.height) * SIZE))
  return makeSquare({ file, rank })
}

function Face({
  position,
  selected,
  targets,
  marks,
  ids,
  onSelect,
  onMark
}: {
  position: SquareOccupant
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
      onClick={event => onSelect(squareAt(event))}
      onContextMenu={event => {
        event.preventDefault()
        onMark(squareAt(event), markColour(event))
      }}>
      <CommandSquare dimmed={position[COMMAND_SQUARE] !== undefined} />
      {Object.entries(marks).map(([square, colour]) => (
        <Wash key={square} square={square} colour={colour} />
      ))}
      {selected !== null && <Wash square={selected} colour={SELECTED} />}
      {/* Drawn in the order the pieces were first seen, never in board order, so a move
          never reorders the elements. Reordering detaches a node, and a detached node
          loses the transition it was in the middle of. */}
      {Object.entries(position)
        .sort(([a], [b]) => (ids.get(a) ?? 0) - (ids.get(b) ?? 0))
        .map(([square, piece]) => (
          <Occupant key={ids.get(square)} square={square} piece={piece} />
        ))}
      {targets.map(square => (
        <Wash key={square} square={square} colour={position[square] ? DEST_CAPTURE : DEST} lift />
      ))}
    </div>
  )
}

export function Board({
  position,
  selected,
  targets,
  lastMove,
  marks,
  onSelect,
  onMark
}: {
  position: SquareOccupant
  selected: string | null
  targets: string[]
  lastMove: Move | null
  marks: Record<string, string>
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}) {
  const ids = useRef(new Map<string, number>())
  const minted = useRef(0)
  const played = useRef<Move | null>(null)
  const fresh = () => (minted.current += 1)
  if (played.current !== lastMove) {
    played.current = lastMove
    reconcile(ids.current, position, lastMove, fresh)
  } else reconcile(ids.current, position, null, fresh)
  return (
    <div className='@container w-full overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `${COORDS} auto`, gridTemplateRows: `auto ${COORDS}` }}>
        <Ranks />
        <Face
          position={position}
          selected={selected}
          targets={targets}
          marks={marks}
          ids={ids.current}
          onSelect={onSelect}
          onMark={onMark}
        />
        <div />
        <Files />
      </div>
    </div>
  )
}