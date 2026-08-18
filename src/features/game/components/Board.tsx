import { useRef } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import type { Piece, SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { parseSquare, makeSquare } from '../lib/coordinate'

/** Width of the gutter that carries the rank and file labels. */
const GUTTER = '1.4rem'

/**
 * The click language lichess and chess.com both use, so a player reads it without
 * being taught: the square picked up from stays tinted, a quiet destination carries
 * a small centred dot, and a destination holding a piece is ringed at its edge so
 * the piece underneath is never covered.
 */
const SELECTED = 'rgba(20, 85, 30, 0.5)'
const QUIET = 'radial-gradient(rgba(20, 85, 30, 0.5) 19%, rgba(0, 0, 0, 0) calc(19% + 1px))'
const CAPTURE = 'radial-gradient(transparent 79%, rgba(200, 30, 30, 0.5) calc(79% + 1px))'

/**
 * Right-click marks, the way both sites let a player think out loud on the board.
 * Plain is red, and the three modifiers give the other three colours.
 */
const MARKS = {
  red: 'rgba(202, 52, 43, 0.55)',
  yellow: 'rgba(216, 166, 40, 0.55)',
  green: 'rgba(20, 133, 45, 0.55)',
  blue: 'rgba(48, 110, 200, 0.55)'
} as const
const markOf = (event: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }): string =>
  event.ctrlKey ? MARKS.yellow : event.shiftKey ? MARKS.green : event.altKey ? MARKS.blue : MARKS.red

/**
 * The single source of truth for tile size. Both grid axes are given this exact
 * value, so a square is square by construction and cannot be knocked out of
 * shape by a parent that stretches its children.
 *
 * The outer `min` is the hard limit: the board never grows wider than the space
 * it is given, so it can never scroll sideways. `cqw` measures the board's own
 * container rather than the viewport, so the side panels are already subtracted.
 *
 * Inside that limit the board aims for 64px, which is the smallest tile the piece
 * artwork stays readable at. The 64px floor applies to the height term only, so a
 * short window is allowed to push the board past the bottom of the screen and
 * scroll down, which is the normal way to scroll a page. A narrow window still
 * shrinks the tiles to fit, because there is no room to trade.
 */
const TILE = `min(calc((100cqw - ${GUTTER}) / 13), max(64px, calc((100vh - 9.5rem) / 13)))`
const EDGE = `calc(13 * ${TILE})`

/**
 * The board carries no square elements at all, the way chessground draws its own:
 * the light and dark tiles are one repeating background, and everything standing
 * on a square is placed by coordinate rather than by parentage. Nothing on the
 * board can be covered by a tile, since there is no tile element to cover it.
 *
 * A conic gradient repeated over two tiles paints the pattern. Its second colour
 * lands on the top left cell, which is a13 and dark, matching a1 dark at the
 * bottom.
 */
const TILES = 'repeating-conic-gradient(var(--square-light) 0% 25%, var(--square-dark) 0% 50%)'

/** Where a square sits on the board, counted from its top left corner. */
const at = (square: string): CSSProperties => {
  const { file, rank } = parseSquare(square)
  return {
    width: TILE,
    height: TILE,
    transform: `translate(calc(${file} * ${TILE}), calc(${SIZE - rank} * ${TILE}))`
  }
}

/**
 * Every piece keeps one element for as long as it stands on the board, and moving
 * only changes the coordinate that element is placed at, so the transition on
 * transform is the whole animation. The map from square to identity is carried
 * here rather than in the game state, since nothing but this render needs it.
 *
 * The move just played says which identity goes where: the mover walks from its
 * square to the one it reached, a castling Sentinel walks with it, and everything
 * captured is dropped. Whatever is left without an identity is new to the board,
 * a promoted piece or the opening position, and is given a fresh one.
 */
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
    <div className='absolute left-0 top-0 bg-square-command' style={at(COMMAND_SQUARE)}>
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
      style={{ gridTemplateRows: `repeat(13, ${TILE})` }}>
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
      style={{ gridTemplateColumns: `repeat(13, ${TILE})` }}>
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
  const rank = SIZE - Math.min(SIZE - 1, Math.floor(((event.clientY - box.top) / box.height) * SIZE))
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
        width: EDGE,
        height: EDGE,
        backgroundImage: TILES,
        backgroundSize: `calc(2 * ${TILE}) calc(2 * ${TILE})`
      }}
      onClick={event => onSelect(squareAt(event))}
      onContextMenu={event => {
        event.preventDefault()
        onMark(squareAt(event), markOf(event))
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
        <Wash key={square} square={square} colour={position[square] ? CAPTURE : QUIET} lift />
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
        style={{ gridTemplateColumns: `${GUTTER} auto`, gridTemplateRows: `auto ${GUTTER}` }}>
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
