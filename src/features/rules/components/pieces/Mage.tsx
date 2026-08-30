import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, SENTINEL, MAGE, HERALD, LEGIONARY } from '@/constants/piece'
import { MARKS } from '@/constants/style'
import { BLAST } from '../constants/scene'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { mageReach, mageBlast } from '../../lib/reach'

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
        A Mage that is taken does not explode. The blast only ever happens on its own turn, as the
        move you choose, so taking a Mage costs nothing extra.
      </p>
    </>
  )
}
function Enhanced() {
  return (
    <Zone isEnhanced>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        One square each move, or two as a leap, and the blast destroys enemy pieces only.
      </p>
      <Diagram
        subject='f7'
        pieces={[
          place(WHITE, MAGE, 'f7', true),
          place(WHITE, MARSHAL, 'g7', false),
          place(BLACK, SENTINEL, 'e6', false)
        ]}
        moves={mageReach(true)}
        captures={null}
      />
      <Diagram
        subject='f7'
        pieces={[
          place(WHITE, MAGE, 'f7', true),
          ...BLAST,
          place(WHITE, MARSHAL, 'g7', false),
          place(WHITE, LEGIONARY, 'g8', true)
        ]}
        moves={null}
        captures={null}
        marks={{ background: MARKS.red, squares: mageBlast(true) }}
      />
    </Zone>
  )
}
function Restricted() {
  return (
    <Zone isEnhanced={false}>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        One square each move, and the blast destroys your own pieces in the ring as well.
      </p>
      <Diagram
        subject='f7'
        pieces={[place(WHITE, MAGE, 'f7', false)]}
        moves={mageReach(false)}
        captures={null}
      />
      <Diagram
        subject='f7'
        pieces={[
          place(WHITE, MAGE, 'f7', false),
          ...BLAST,
          place(WHITE, HERALD, 'f8', false),
          place(WHITE, LEGIONARY, 'g8', false)
        ]}
        moves={null}
        captures={null}
        marks={{ background: MARKS.red, squares: mageBlast(false) }}
      />
    </Zone>
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
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Enhanced />
        <Restricted />
      </div>
      <Blast />
    </section>
  )
}