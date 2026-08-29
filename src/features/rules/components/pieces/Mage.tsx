import { MAGE } from '@/constants/piece'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'

function Blast() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The eight squares around the Mage are its ring. A turn is either a move or a blast, never
        both. When it blasts it stays where it is and comes through its own blast unharmed, and it
        may blast again the turn after.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A blast needs at least one enemy piece in the ring. An empty ring is not allowed, and
        neither is a ring holding only your own pieces, because either one would be a wasted turn.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A restricted blast that would destroy your own Pope is not allowed. Standing next to the
        enemy Pope is already check, because the blast on the next turn would take it.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A sleeping Emperor is left standing by any blast, yours or theirs, and a Mage that dies does
        not explode.
      </p>
    </>
  )
}
export function Mage() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Mage</h3>
      <Counterpart from={null} to={MAGE} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Moves one square in any of the eight directions, and two squares while enhanced. The
        two-square move is a leap, so a piece standing on the square in between neither stops it nor
        is taken. The square it lands on must be empty. What is different is how it kills: a Mage
        never takes a piece by moving onto it. Instead it blasts everything standing next to it.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            One square each move, or two as a leap, and the blast destroys enemy pieces only.
          </p>
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            One square each move, and the blast destroys your own pieces in the ring as well.
          </p>
        </Zone>
      </div>
      <Blast />
    </section>
  )
}