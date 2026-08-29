import { WHITE } from '@/constants/player'
import { MARSHAL, HERALD } from '@/constants/piece'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { heraldReach, heraldDiagonals } from '../../lib/reach'

export function Herald() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Herald</h3>
      <Counterpart from='bishop' to={HERALD} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The bishop of this game, with one extra move: a single step straight up, down, left or
        right. That step is what lets it change square colour, so it is not stuck on one colour for
        the whole game the way a bishop is.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Diagonals with no limit, for moving and for capturing. The straight step can capture as
            well.
          </p>
          <Diagram
            subject='c3'
            pieces={[place(WHITE, HERALD, 'c3', true), place(WHITE, MARSHAL, 'f3', false)]}
            moves={heraldReach(true)}
            captures={heraldReach(true)}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Diagonals up to six squares, for moving and for capturing. The straight step is still
            there, but it cannot capture.
          </p>
          <Diagram
            subject='c3'
            pieces={[place(WHITE, HERALD, 'c3', false)]}
            moves={heraldReach(false)}
            captures={heraldDiagonals(false)}
          />
        </Zone>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Its diagonal reach is the same whether it is moving to an empty square or taking a piece.
      </p>
    </section>
  )
}