import { WHITE } from '@/constants/player'
import { MARSHAL, TEMPLAR } from '@/constants/piece'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { templarLeap } from '../../lib/reach'

export function Templar() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Templar</h3>
      <Counterpart from='knight' to={TEMPLAR} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The knight of this game. Every move is a leap, so the pieces in between do not matter, and
        the piece it lands on is the piece it takes.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Two leap shapes, three squares one way and two the other, or two squares one way and one
            the other, which is the knight leap of chess.
          </p>
          <Diagram
            subject='g7'
            pieces={[place(WHITE, TEMPLAR, 'g7', true), place(WHITE, MARSHAL, 'g6', false)]}
            moves={templarLeap(true)}
            captures={templarLeap(true)}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            One leap shape only, three squares one way and two the other. The knight leap is gone.
          </p>
          <Diagram
            subject='g7'
            pieces={[place(WHITE, TEMPLAR, 'g7', false)]}
            moves={templarLeap(false)}
            captures={templarLeap(false)}
          />
        </Zone>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The leap it gains is the shorter one, so a restricted Templar always lands far from where it
        started.
      </p>
    </section>
  )
}