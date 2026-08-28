import type { CSSProperties } from 'react'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { COORDS, SQUARE, PATTERN, FONT_SIZE, BASELINE } from '@/constants/style'
import { translate } from '@/features/game/lib/layout'

const scale = {
  '--square-size': `min(3rem, calc((100cqw - ${COORDS}) / ${SIZE}))`
} as CSSProperties

function CommandSquare() {
  return (
    <div
      className='absolute left-0 top-0 bg-square-command'
      style={translate(COMMAND_SQUARE, false)}>
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
  )
}
export function Diagram() {
  return (
    <div className='@container mt-4 select-none'>
      <div
        className='mx-auto grid w-fit'
        style={{
          ...scale,
          gridTemplateColumns: `${COORDS} auto`,
          gridTemplateRows: `auto ${COORDS}`
        }}>
        <div
          className='grid font-mono text-[10px] text-ink-faint'
          style={{ gridTemplateRows: `repeat(${SIZE}, ${SQUARE})` }}>
          {RANKS.toReversed().map(rank => (
            <span key={rank} className='flex items-center justify-end pr-2'>
              {rank}
            </span>
          ))}
        </div>
        <div
          className='pointer-events-none relative overflow-hidden rounded-[3px] outline outline-square-edge'
          style={{
            width: `calc(${SIZE} * ${SQUARE})`,
            height: `calc(${SIZE} * ${SQUARE})`,
            backgroundImage: PATTERN,
            backgroundSize: `calc(2 * ${SQUARE}) calc(2 * ${SQUARE})`
          }}>
          <CommandSquare />
        </div>
        <div />
        <div
          className='grid font-mono text-[10px] text-ink-faint'
          style={{ gridTemplateColumns: `repeat(${SIZE}, ${SQUARE})` }}>
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