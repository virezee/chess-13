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
        The knight of this game. Every move is a jump, so the pieces in between do not matter, and
        the piece it lands on is the piece it takes.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Two jump shapes, three squares one way and two the other, or two squares one way and one
            the other, which is the knight jump of chess.
          </p>
          <Diagram
            piece={place(WHITE, TEMPLAR, 'g7', true)}
            pieces={[place(WHITE, MARSHAL, 'g6', false)]}
            moves={templarLeap(true)}
            captures={templarLeap(true)}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            One jump shape only, three squares one way and two the other. The knight jump is gone.
          </p>
          <Diagram
            piece={place(WHITE, TEMPLAR, 'g7', false)}
            pieces={null}
            moves={templarLeap(false)}
            captures={templarLeap(false)}
          />
        </Zone>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The jump it gains is the shorter one, so a restricted Templar always lands far from where it
        started.
      </p>
    </section>
  )
}