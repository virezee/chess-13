import { WHITE } from '@/constants/player'
import { MARSHAL, SENTINEL, TEMPLAR } from '@/constants/piece'
import { sentinel } from '@/features/game/engine/moves'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Enhanced() {
  return (
    <Zone isEnhanced>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        Six squares on a quiet move, no limit when it takes, and it passes through your own pieces
        towards your Marshal.
      </p>
      <Diagram
        subject='a1'
        pieces={[
          place(WHITE, SENTINEL, 'a1', true),
          place(WHITE, MARSHAL, 'd3', false),
          place(WHITE, TEMPLAR, 'd1', true)
        ]}
        {...squares(occupancy =>
          sentinel(
            WHITE,
            {
              ...occupancy,
              d3: { side: WHITE, piece: MARSHAL },
              d1: { side: WHITE, piece: TEMPLAR }
            },
            'a1',
            'd3',
            true
          )
        )}
      />
    </Zone>
  )
}
function Restricted() {
  return (
    <Zone isEnhanced={false}>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        Three squares on a quiet move, six when it takes, and any piece blocks it.
      </p>
      <Diagram
        subject='a1'
        pieces={[place(WHITE, SENTINEL, 'a1', false)]}
        {...squares(occupancy => sentinel(WHITE, occupancy, 'a1', 'd3', false))}
      />
    </Zone>
  )
}
export function Sentinel() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Sentinel</h3>
      <Counterpart from='rook' to={SENTINEL} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The rook of this game. Straight lines only, and the path has to be clear. How far it goes
        depends on whether the move takes something: a capture reaches further than a quiet move, so
        an enemy piece far down the line is still in range.
      </p>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Towards your Marshal it passes through your own pieces, never theirs. After passing through
        it can no longer take: the move ends on the last free square before that piece.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Enhanced />
        <Restricted />
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Towards is measured one axis at a time, not by standing on the same line. Along a rank it is
        the direction that closes the distance in files, along a file the direction that closes the
        distance in ranks. With the Marshal on d3, a Sentinel on a1 heads towards it both east and
        north.
      </p>
    </section>
  )
}