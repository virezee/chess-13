import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, SENTINEL, HERALD, TEMPLAR } from '@/constants/piece'
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
        Six squares on a quiet move, no limit when it captures, and it passes through your own
        pieces towards your Marshal.
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
        Three squares on a quiet move, six when it captures, and any piece blocks it.
      </p>
      <Diagram
        subject='a1'
        pieces={[place(WHITE, SENTINEL, 'a1', false)]}
        {...squares(occupancy => sentinel(WHITE, occupancy, 'a1', 'd3', false))}
      />
    </Zone>
  )
}
function Capture() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          It reaches it only by capturing
        </p>
        <Diagram
          subject='a1'
          pieces={[place(WHITE, SENTINEL, 'a1', false), place(BLACK, HERALD, 'a7', false)]}
          {...squares(occupancy =>
            sentinel(WHITE, { ...occupancy, a7: { side: BLACK, piece: HERALD } }, 'a1', 'd3', false)
          )}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          It passes through, then cannot capture
        </p>
        <Diagram
          subject='a1'
          pieces={[
            place(WHITE, SENTINEL, 'a1', true),
            place(WHITE, MARSHAL, 'd3', false),
            place(WHITE, HERALD, 'a3', true),
            place(BLACK, HERALD, 'a5', false)
          ]}
          {...squares(occupancy =>
            sentinel(
              WHITE,
              {
                ...occupancy,
                d3: { side: WHITE, piece: MARSHAL },
                a3: { side: WHITE, piece: HERALD },
                a5: { side: BLACK, piece: HERALD }
              },
              'a1',
              'd3',
              true
            )
          )}
        />
      </div>
    </div>
  )
}
export function Sentinel() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Sentinel</h3>
      <Counterpart from='rook' to={SENTINEL} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The rook of this game. Straight lines only, and the path has to be clear. How far it goes
        depends on whether the move captures: a capture reaches further than a quiet move, so an
        enemy piece far down the line is still in range.
      </p>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        It slides along a rank or a file while the line stays clear. Two of its moves carry a
        condition: a square too far for a quiet move is still open if the move captures the piece
        standing there, and your own pieces let it through while it heads towards your Marshal.
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
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Once it has passed through it can no longer capture, so the move ends on the last free
        square before the next piece. A square that far cannot be moved to on a quiet move either,
        so the only way to reach it is by capturing the piece standing there.
      </p>
      <Capture />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A far square is open only to a capture, and a line that has already gone through your own
        piece cannot make one at all.
      </p>
    </section>
  )
}