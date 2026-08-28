import { Herald } from './pieces/Herald'
import { Sentinel } from './pieces/Sentinel'
import { Templar } from './pieces/Templar'

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
      </section>
      <Herald />
      <Sentinel />
      <Templar />
    </>
  )
}