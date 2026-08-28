import type { CSSProperties } from 'react'
import type { Side } from '@/types/material'
import Image from 'next/image'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import {
  COORDS,
  SQUARE,
  PATTERN,
  FONT_SIZE,
  BASELINE,
  SELECTED,
  DEST,
  DEST_CAPTURE,
  BUFF
} from '@/constants/style'
import { WHITE } from '@/constants/player'
import { translate } from '@/features/game/lib/layout'

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
function Fill({ square, background }: { square: string; background: string }) {
  return (
    <div className='absolute left-0 top-0' style={{ ...translate(square, false), background }} />
  )
}
function Piece({
  square,
  name,
  side,
  isBuffed
}: {
  square: string
  name: string
  side?: Side | undefined
  isBuffed?: boolean | undefined
}) {
  return (
    <div className='absolute left-0 top-0' style={translate(square, false)}>
      {isBuffed === true && (
        <span
          className='absolute inset-0'
          style={{
            background: BUFF[side ?? WHITE],
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
          }}
        />
      )}
      <Image
        src={`/${side ?? WHITE}/${name}.png`}
        alt={name}
        fill
        sizes={SQUARE}
        className='object-contain'
      />
    </div>
  )
}
function Mover(figure: {
  square: string
  name: string
  side?: Side | undefined
  isBuffed?: boolean | undefined
}) {
  return (
    <>
      <Fill square={figure.square} background={SELECTED} />
      <Piece {...figure} />
    </>
  )
}
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
export function Diagram({
  piece,
  pieces,
  moves,
  captures
}: {
  piece?: { square: string; name: string; side?: Side; isBuffed?: boolean }
  pieces?: { square: string; name: string; side?: Side; isBuffed?: boolean }[]
  moves?: string[]
  captures?: string[]
}) {
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
          <CommandSquare />
          {moves?.map(square => (
            <Fill key={square} square={square} background={DEST} />
          ))}
          {captures?.map(square => (
            <Fill key={square} square={square} background={DEST_CAPTURE} />
          ))}
          {pieces?.map(figure => (
            <Piece key={figure.square} {...figure} />
          ))}
          {piece !== undefined && <Mover {...piece} />}
        </div>
        <div />
        <Files />
      </div>
    </div>
  )
}