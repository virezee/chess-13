import type { CSSProperties } from 'react'
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
  DEST_CAPTURE
} from '@/constants/style'
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
function Piece({ square, name }: { square: string; name: string }) {
  return (
    <div className='absolute left-0 top-0' style={translate(square, false)}>
      <Image src={`/white/${name}.png`} alt={name} fill sizes={SQUARE} className='object-contain' />
    </div>
  )
}
function Mover({ square, name }: { square: string; name: string }) {
  return (
    <>
      <Fill square={square} background={SELECTED} />
      <Piece square={square} name={name} />
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
  piece?: { square: string; name: string }
  pieces?: { square: string; name: string }[]
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
          {pieces?.map(({ square, name }) => (
            <Piece key={square} square={square} name={name} />
          ))}
          {piece !== undefined && <Mover square={piece.square} name={piece.name} />}
        </div>
        <div />
        <Files />
      </div>
    </div>
  )
}