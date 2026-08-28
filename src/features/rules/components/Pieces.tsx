import { SELECTED, DEST, DEST_CAPTURE } from '@/constants/style'
import { Herald } from './pieces/Herald'
import { Sentinel } from './pieces/Sentinel'
import { Templar } from './pieces/Templar'
import { Legionary } from './pieces/Legionary'

function Mark({
  background,
  letter,
  children
}: {
  background: string
  letter?: string
  children: string
}) {
  return (
    <li className='flex items-center gap-3'>
      <span className='size-9 shrink-0 select-none rounded-[3px] bg-square-dark outline outline-square-edge'>
        <span
          className='flex h-full w-full items-center justify-center font-command text-[17px] text-square-command-ink'
          style={{ background }}>
          {letter}
        </span>
      </span>
      <span className='text-[14px] leading-snug text-ink-dim'>{children}</span>
    </li>
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
        <ul className='mt-3.5 grid gap-2.5 sm:grid-cols-2'>
          <Mark background={DEST}>A green dot is a square the piece can move to.</Mark>
          <Mark background={DEST_CAPTURE}>A red ring is a square where it can take a piece.</Mark>
          <Mark background={SELECTED}>The green square is where the piece is standing.</Mark>
          <Mark background='var(--square-command)' letter='M'>
            The purple square is the command square, drawn on every board.
          </Mark>
        </ul>
      </section>
      <Herald />
      <Sentinel />
      <Templar />
      <Legionary />
    </>
  )
}