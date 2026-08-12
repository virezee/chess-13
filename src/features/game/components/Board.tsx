import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { FILES, RANKS } from '@/constants/board'
import type { Piece, Position } from '@/types/piece'
import type { Move } from '@/types/move'

/** The Marshal's command square, at the exact centre of the board. */
const COMMAND_FILE = 6
const COMMAND_RANK = 7

/** Width of the gutter that carries the rank and file labels. */
const GUTTER = '1.4rem'

/**
 * The click language lichess and chess.com both use, so a player reads it without
 * being taught: the square picked up from stays tinted, a quiet destination carries
 * a small centred dot, and a destination holding a piece is ringed at its edge so
 * the piece underneath is never covered.
 *
 * The stops are lichess's own values. The second stop is one pixel past the first
 * rather than one per cent past it, because a percentage gap resolves to a
 * fractional pixel at most tile sizes and leaves the circle visibly jagged.
 */
/**
 * Right-click marks, the way both sites let a player think out loud on the board.
 * Plain is red, and the three modifiers give the other three colours. They are
 * drawn after the square and before the piece, so a marked square never hides what
 * stands on it. Document order alone puts them there: all three layers are
 * absolutely positioned siblings, so the later one paints on top and no z-index is
 * involved.
 */
const MARKS = {
  red: 'rgba(202, 52, 43, 0.55)',
  yellow: 'rgba(216, 166, 40, 0.55)',
  green: 'rgba(20, 133, 45, 0.55)',
  blue: 'rgba(48, 110, 200, 0.55)'
} as const
const markOf = (event: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }): string =>
  event.ctrlKey ? MARKS.yellow : event.shiftKey ? MARKS.green : event.altKey ? MARKS.blue : MARKS.red

const SELECTED = 'rgba(20, 85, 30, 0.5)'
const QUIET = 'radial-gradient(rgba(20, 85, 30, 0.5) 19%, rgba(0, 0, 0, 0) calc(19% + 1px))'
const CAPTURE = 'radial-gradient(transparent 79%, rgba(20, 85, 30, 0.3) calc(79% + 1px))'

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

/**
 * The M sits inside an SVG so it scales with the square instead of with a font
 * size. Width is the binding dimension for this glyph, so FONT_SIZE fills the
 * box horizontally, and BASELINE puts the cap exactly halfway down: half of the
 * cap height below the centre line. Tune CAP_HEIGHT if the glyph reads high or
 * low.
 */
const CAP_HEIGHT = 0.7
const FONT_SIZE = 80
const BASELINE = 50 + (FONT_SIZE * CAP_HEIGHT) / 2

/**
 * Where the piece stood before this move, written as an offset from where it
 * stands now. The animation starts at that offset and runs to zero, so the piece
 * reads as travelling from its old square rather than appearing on the new one.
 */
const travel = (from: string, to: string): CSSProperties =>
  ({
    '--dx': `calc(${FILES.indexOf(from[0]) - FILES.indexOf(to[0])} * ${TILE})`,
    '--dy': `calc(${Number(to.slice(1)) - Number(from.slice(1))} * ${TILE})`
  }) as CSSProperties

function CommandGlyph({ dimmed }: { dimmed: boolean }) {
  return (
    <svg
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid meet'
      className={cn('absolute inset-0 h-full w-full', dimmed ? 'opacity-25' : 'opacity-70')}
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
  )
}

/**
 * The artwork is a single 480px square per piece, scaled down by the browser to
 * whatever the tile currently measures. Nothing here is tied to a pixel size, so
 * the piece stays sharp at 26px on a phone and at 68px on a desktop.
 */
function PieceArt({ piece }: { piece: Piece }) {
  return (
    <img
      src={`/pieces/${piece.side}/${piece.piece}.png`}
      alt={`${piece.side} ${piece.piece}`}
      draggable={false}
      className='pointer-events-none absolute inset-0 h-full w-full select-none object-contain'
    />
  )
}

function Wash({ colour }: { colour: string }) {
  return <div className='pointer-events-none absolute inset-0' style={{ background: colour }} />
}

function Occupant({
  piece,
  square,
  slideFrom
}: {
  piece: Piece
  square: string
  slideFrom: string | undefined
}) {
  if (slideFrom === undefined) return <PieceArt piece={piece} />
  return (
    <div
      key={slideFrom}
      className='piece-slide absolute inset-0'
      style={travel(slideFrom, square)}>
      <PieceArt piece={piece} />
    </div>
  )
}

function Square({
  square,
  isLight,
  isCommand,
  isSelected,
  isTarget,
  slideFrom,
  mark,
  piece,
  onSelect,
  onMark
}: {
  square: string
  isLight: boolean
  isCommand: boolean
  isSelected: boolean
  isTarget: boolean
  slideFrom: string | undefined
  mark: string | undefined
  piece: Piece | undefined
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}) {
  return (
    <button
      type='button'
      data-square={square}
      onClick={() => onSelect(square)}
      onContextMenu={event => {
        event.preventDefault()
        onMark(square, markOf(event))
      }}
      className={cn(
        'relative',
        isCommand && 'bg-square-command',
        !isCommand && (isLight ? 'bg-square-light' : 'bg-square-dark'),
        (piece || isTarget) && 'cursor-pointer'
      )}>
      {isCommand && <CommandGlyph dimmed={piece !== undefined} />}
      {mark && <Wash colour={mark} />}
      {isSelected && <Wash colour={SELECTED} />}
      {piece && <Occupant piece={piece} square={square} slideFrom={slideFrom} />}
      {isTarget && <Wash colour={piece ? CAPTURE : QUIET} />}
    </button>
  )
}

/**
 * The square a piece has just left, so the one standing here can be animated in
 * from it. Castling moves two pieces, and a weak Mage dies on its own square, so
 * neither the Sentinel nor a mover that never arrives can be read from `to` alone.
 */
const slideFrom = (lastMove: Move | null, square: string): string | undefined => {
  if (lastMove === null) return undefined
  if (lastMove.sentinel?.to === square) return lastMove.sentinel.from
  if (lastMove.to !== square || lastMove.captures?.includes(lastMove.from)) return undefined
  return lastMove.from
}

function Squares({
  position,
  selected,
  targets,
  lastMove,
  marks,
  onSelect,
  onMark
}: {
  position: Position
  selected: string | null
  targets: string[]
  lastMove: Move | null
  marks: Record<string, string>
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}) {
  return (
    <div
      className='grid overflow-hidden rounded-[3px] outline outline-square-edge'
      style={{
        gridTemplateColumns: `repeat(13, ${TILE})`,
        gridTemplateRows: `repeat(13, ${TILE})`
      }}>
      {RANKS.toReversed().map(rank =>
        FILES.map((file, index) => {
          const square = `${file}${rank}`
          return (
            <Square
              key={square}
              square={square}
              isLight={(index + rank) % 2 === 0}
              isCommand={index === COMMAND_FILE && rank === COMMAND_RANK}
              isSelected={square === selected}
              isTarget={targets.includes(square)}
              slideFrom={slideFrom(lastMove, square)}
              mark={marks[square]}
              piece={position[square]}
              onSelect={onSelect}
              onMark={onMark}
            />
          )
        })
      )}
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
  position: Position
  selected: string | null
  targets: string[]
  lastMove: Move | null
  marks: Record<string, string>
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}) {
  return (
    <div className='@container w-full overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{
          gridTemplateColumns: `${GUTTER} auto`,
          gridTemplateRows: `auto ${GUTTER}`
        }}>
        <div
          className='grid font-mono text-[10px] text-ink-faint'
          style={{ gridTemplateRows: `repeat(13, ${TILE})` }}>
          {RANKS.toReversed().map(rank => (
            <span key={rank} className='flex items-center justify-end pr-2'>
              {rank}
            </span>
          ))}
        </div>
        <Squares
          position={position}
          selected={selected}
          targets={targets}
          lastMove={lastMove}
          marks={marks}
          onSelect={onSelect}
          onMark={onMark}
        />
        <div />
        <div
          className='grid font-mono text-[10px] text-ink-faint'
          style={{ gridTemplateColumns: `repeat(13, ${TILE})` }}>
          {FILES.map(file => (
            <span key={file} className='flex justify-center pt-2'>
              {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}