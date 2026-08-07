import { cn } from '@/lib/cn'
import { FILES, RANKS } from '@/constants/board'
import { Piece, Position } from '@/types/piece'

/** The Marshal's command square, at the exact centre of the board. */
const COMMAND_FILE = 6
const COMMAND_RANK = 7

/** Width of the gutter that carries the rank and file labels. */
const GUTTER = '1.4rem'

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

function CommandGlyph() {
  return (
    <svg
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid meet'
      className='absolute inset-0 h-full w-full'
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
      src={`/pieces/${piece.side}/${piece.type}.png`}
      alt={`${piece.side} ${piece.type}`}
      draggable={false}
      className='pointer-events-none absolute inset-0 h-full w-full select-none object-contain'
    />
  )
}

function Square({
  square,
  isLight,
  isCommand,
  piece
}: {
  square: string
  isLight: boolean
  isCommand: boolean
  piece: Piece | undefined
}) {
  return (
    <div
      data-square={square}
      className={cn(
        'relative',
        isCommand && 'bg-square-command',
        !isCommand && (isLight ? 'bg-square-light' : 'bg-square-dark')
      )}>
      {isCommand && <CommandGlyph />}
      {piece && <PieceArt piece={piece} />}
    </div>
  )
}

export function Board({ position }: { position: Position }) {
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
          {RANKS.map((rank) => (
            <span key={rank} className='flex items-center justify-end pr-2'>
              {rank}
            </span>
          ))}
        </div>
        <div
          className='grid overflow-hidden rounded-[3px] outline outline-square-edge'
          style={{
            gridTemplateColumns: `repeat(13, ${TILE})`,
            gridTemplateRows: `repeat(13, ${TILE})`
          }}>
          {RANKS.map((rank) =>
            FILES.map((file, index) => {
              const square = `${file}${rank}`
              return (
                <Square
                  key={square}
                  square={square}
                  isLight={(index + rank) % 2 === 0}
                  isCommand={index === COMMAND_FILE && rank === COMMAND_RANK}
                  piece={position[square]}
                />
              )
            })
          )}
        </div>
        <div />
        <div
          className='grid font-mono text-[10px] text-ink-faint'
          style={{ gridTemplateColumns: `repeat(13, ${TILE})` }}>
          {FILES.map((file) => (
            <span key={file} className='flex justify-center pt-2'>
              {file}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}