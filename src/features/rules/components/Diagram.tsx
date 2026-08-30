import type { CSSProperties, ReactNode } from 'react'
import type { Step } from '@/types/game'
import type { BoardPiece } from '../types/setup'
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
  DEST_CAPTURE
} from '@/constants/style'
import { translate } from '@/features/game/lib/layout'
import { arrowPoints } from '@/features/game/lib/annotation'

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
function Piece(props: BoardPiece) {
  const { side, piece, square, isEnhanced } = props
  return (
    <div className='absolute left-0 top-0' style={translate(square, false)}>
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
  arrows
}: {
  subject: string | null
  pieces: BoardPiece[] | null
  moves: string[] | null
  captures: string[] | null
  marks?: { squares: string[]; background: string; clip?: string }
  arrows?: { steps: Step[]; fill: string }[]
}) {
  return (
    <Board>
      <CommandSquare />
      {subject !== null && <Fill square={subject} background={SELECTED} />}
      {moves?.map(square => (
        <Fill key={square} square={square} background={DEST} />
      ))}
      {captures?.map(square => (
        <Fill key={square} square={square} background={DEST_CAPTURE} />
      ))}
      {marks?.squares.map(square => (
        <Fill key={square} square={square} background={marks.background} clip={marks.clip} />
      ))}
      {pieces?.map(figure => (
        <Piece key={figure.square} {...figure} />
      ))}
      {arrows?.map(group => (
        <Arrows key={group.fill} fill={group.fill} steps={group.steps} />
      ))}
    </Board>
  )
}