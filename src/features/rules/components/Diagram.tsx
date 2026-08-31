import type { CSSProperties, ReactNode } from 'react'
import type { Trace, Step } from '@/types/game'
import type { BoardPiece, DiagramMarks } from '../types/setup'
import Image from 'next/image'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import {
  COORDS,
  SQUARE,
  PATTERN,
  FONT_SIZE,
  BASELINE,
  BUFF,
  SELECTED,
  DEST,
  DEST_CAPTURE,
  STAGGER
} from '@/constants/style'
import { translate } from '@/features/game/lib/layout'
import { arrowPoints } from '@/features/game/lib/annotation'
import { cn } from '@/lib/cn'

function Files() {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateColumns: `repeat(${SIZE}, ${SQUARE})` }}>
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
      style={{ gridTemplateRows: `repeat(${SIZE}, ${SQUARE})` }}>
      {RANKS.toReversed().map(rank => (
        <span key={rank} className='flex items-center justify-end pr-2'>
          {rank}
        </span>
      ))}
    </div>
  )
}
function Board({ children }: { children: ReactNode }) {
  return (
    <div className='@container mt-4 select-none'>
      <div
        className='mx-auto grid w-fit'
        style={
          {
            '--square-size': `min(3rem, calc((100cqw - ${COORDS}) / ${SIZE}))`,
            gridTemplateColumns: `${COORDS} auto`,
            gridTemplateRows: `auto ${COORDS}`
          } as CSSProperties
        }>
        <Ranks />
        <div
          className='pointer-events-none relative overflow-hidden rounded-[3px] outline outline-square-edge'
          style={{
            width: `calc(${SIZE} * ${SQUARE})`,
            height: `calc(${SIZE} * ${SQUARE})`,
            backgroundImage: PATTERN,
            backgroundSize: `calc(2 * ${SQUARE}) calc(2 * ${SQUARE})`
          }}>
          {children}
        </div>
        <div />
        <Files />
      </div>
    </div>
  )
}
function CommandSquare() {
  return (
    <div className='absolute left-0 top-0' style={translate(COMMAND_SQUARE, false)}>
      <div className='h-full w-full bg-square-command'>
        <svg viewBox='0 0 100 100' className='h-full w-full opacity-70' aria-hidden>
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
    </div>
  )
}
function Piece(props: BoardPiece & { isAnimated: boolean }) {
  const { side, piece, square, isEnhanced, isAnimated } = props
  return (
    <div
      className={cn(
        'absolute left-0 top-0',
        isAnimated && 'transition-transform duration-200 ease-out'
      )}
      style={translate(square, false)}>
      {isEnhanced && (
        <span
          className='absolute inset-0'
          style={{
            background: BUFF[side],
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
          }}
        />
      )}
      <Image
        src={`/${side}/${piece}.png`}
        alt={piece}
        fill
        sizes={SQUARE}
        className='object-contain'
      />
    </div>
  )
}
function Fill({
  square,
  background,
  clip
}: {
  square: string
  background: string
  clip?: string | undefined
}) {
  return (
    <div
      className='absolute left-0 top-0'
      style={{ ...translate(square, false), background, clipPath: clip }}
    />
  )
}
function Subject({ square }: { square: string | null }) {
  if (square === null) return null
  return <Fill square={square} background={SELECTED} />
}
function Moves({ squares }: { squares: string[] | null }) {
  return squares?.map(square => <Fill key={square} square={square} background={DEST} />)
}
function Captures({ squares }: { squares: string[] | null }) {
  return squares?.map(square => <Fill key={square} square={square} background={DEST_CAPTURE} />)
}
function Marks({ marks }: { marks: DiagramMarks | undefined }) {
  return marks?.squares.map(square => (
    <Fill key={square} square={square} background={marks.background} clip={marks.clip} />
  ))
}
function Arrows({ steps, fill }: { steps: Step[]; fill: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className='pointer-events-none absolute inset-0'
      aria-hidden>
      {steps.map(step => (
        <polygon key={`${step.from}-${step.to}`} points={arrowPoints(step, false)} fill={fill} />
      ))}
    </svg>
  )
}
export function Diagram({
  subject,
  pieces,
  moves,
  captures,
  marks,
  arrows,
  isAnimated = false,
  trace
}: {
  subject: string | null
  pieces: BoardPiece[] | null
  moves: string[] | null
  captures: string[] | null
  marks?: DiagramMarks
  arrows?: { steps: Step[]; fill: string }[]
  isAnimated?: boolean
  trace?: Trace[] | undefined
}) {
  return (
    <Board>
      <CommandSquare />
      <Subject square={subject} />
      <Moves squares={moves} />
      <Captures squares={captures} />
      <Marks marks={marks} />
      {trace?.map(({ square, delay, colour }) => (
        <div
          key={`${square}-${delay}`}
          className='absolute left-0 top-0'
          style={{
            ...translate(square, false),
            background: colour,
            animation: `chase ${STAGGER.duration}ms ease-out ${delay}ms both`
          }}
        />
      ))}
      {pieces?.map(figure => (
        <Piece key={`${figure.side}${figure.piece}`} {...figure} isAnimated={isAnimated} />
      ))}
      {arrows?.map(group => (
        <Arrows key={group.fill} fill={group.fill} steps={group.steps} />
      ))}
    </Board>
  )
}