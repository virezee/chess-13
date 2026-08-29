import { WHITE } from '@/constants/player'
import { MARSHAL, SENTINEL } from '@/constants/piece'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { sentinelReach, sentinelCapture } from '../../lib/reach'

export function Sentinel() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Sentinel</h3>
      <Counterpart from='rook' to={SENTINEL} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The rook of this game. Straight lines only, up, down, left and right, and the path has to be
        clear. What changes is how far it goes, and that depends on whether the move takes
        something.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Up to six squares on a quiet move, and no limit for capturing. It also passes through
            your own pieces when it moves towards your Marshal.
          </p>
          <Diagram
            piece={place(WHITE, SENTINEL, 'a1', true)}
            pieces={[place(WHITE, MARSHAL, 'd1', false)]}
            moves={sentinelReach(true)}
            captures={sentinelCapture(true)}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Up to three squares on a quiet move, up to six on a move that captures. Any piece blocks
            it, yours or theirs.
          </p>
          <Diagram
            piece={place(WHITE, SENTINEL, 'a1', false)}
            pieces={null}
            moves={sentinelReach(false)}
            captures={sentinelCapture(false)}
          />
        </Zone>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Taking a piece reaches further than moving to an empty square, so an enemy piece far down
        the line can still be captured.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Move it towards your Marshal and it passes through your own pieces, landing on any free
        square after them. It never passes through theirs.
      </p>
    </section>
  )
}