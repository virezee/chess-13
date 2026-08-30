import { FONT_SIZE, BASELINE, BUFF, SELECTED, DEST, DEST_CAPTURE, MARKS } from '@/constants/style'
import { arrowPoints } from '@/features/game/lib/annotation'
import { Herald } from './pieces/Herald'
import { Sentinel } from './pieces/Sentinel'
import { Templar } from './pieces/Templar'
import { Legionary } from './pieces/Legionary'
import { Mage } from './pieces/Mage'
import { Assassin } from './pieces/Assassin'
// import { Marshal } from './pieces/Marshal'
// import { Emperor } from './pieces/Emperor'
// import { Pope } from './pieces/Pope'

function Mark({
  background,
  letter,
  arrow,
  children
}: {
  background?: string
  letter?: string
  arrow?: string
  children: string
}) {
  return (
    <li className='flex items-center gap-3'>
      {arrow === undefined ? (
        <span className='size-7 shrink-0 select-none rounded-xs bg-square-dark outline outline-square-edge'>
          <span className='block h-full w-full' style={{ background }}>
            <svg viewBox='0 0 100 100' className='h-full w-full opacity-70' aria-hidden>
              <text
                x='50'
                y={BASELINE}
                textAnchor='middle'
                fontSize={FONT_SIZE}
                className='fill-square-command-ink font-command'>
                {letter}
              </text>
            </svg>
          </span>
        </span>
      ) : (
        <svg viewBox='0.85 12.17 0.66 0.66' className='size-7 shrink-0' aria-hidden>
          <polygon points={arrowPoints({ from: 'a1', to: 'b1' }, false)} fill={arrow} />
        </svg>
      )}
      <span className='text-[13px] leading-snug text-ink-dim'>{children}</span>
    </li>
  )
}
function Legend() {
  return (
    <div className='mt-4 rounded border border-ink/20 bg-ink/5 px-3.5 py-3'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>Legend</p>
      <ul className='mt-2.5 grid gap-2 sm:grid-cols-2'>
        <Mark background={SELECTED}>The green square is the piece being explained.</Mark>
        <Mark background={DEST}>A green dot is a square the piece can move to.</Mark>
        <Mark background={DEST_CAPTURE}>
          Red corners are a square the piece can move to only when the move takes a piece.
        </Mark>
        <Mark background={MARKS.red}>A red square is a piece caught in a blast.</Mark>
        <Mark arrow={MARKS.red}>
          A red arrow shows the piece attacking an opponent&apos;s piece.
        </Mark>
        <Mark arrow={MARKS.blue}>
          A blue arrow shows the piece defending a piece of the same colour.
        </Mark>
        <Mark
          background={`linear-gradient(to bottom right, transparent 50%, ${BUFF.white} 50%) top left/50% 50% no-repeat, linear-gradient(to bottom left, transparent 50%, ${BUFF.white} 50%) top right/50% 50% no-repeat, linear-gradient(to top right, transparent 50%, ${BUFF.white} 50%) bottom left/50% 50% no-repeat, linear-gradient(to top left, transparent 50%, ${BUFF.white} 50%) bottom right/50% 50% no-repeat`}>
          The badge behind a piece means it is enhanced.
        </Mark>
        <Mark background='var(--square-command)' letter='M'>
          The purple square is the command square.
        </Mark>
      </ul>
    </div>
  )
}
export function Pieces() {
  return (
    <>
      <section>
        <h2 className='font-reading text-[22px] leading-none text-ink'>The Pieces</h2>
        <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
          There are nine kinds. Only two of them move the way they do in chess, the Pope and the
          Emperor. The other seven are new, and each one is written out below in both versions,
          enhanced first, then restricted.
        </p>
        <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
          They are in order from the easiest to the hardest, so read them from the top the first
          time.
        </p>
        <Legend />
      </section>
      <Herald />
      <Sentinel />
      <Templar />
      <Legionary />
      <Mage />
      <Assassin />
      {/* <Marshal /> */}
      {/* <Emperor /> */}
      {/* <Pope /> */}
    </>
  )
}