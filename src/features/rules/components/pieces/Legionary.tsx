import { COMMAND_SQUARE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, LEGIONARY } from '@/constants/piece'
import { legionary } from '@/features/game/engine/moves'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Advance() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Rank 7 is the middle rank. Below it a Legionary moves straight forward to any empty square
        up to rank 7 and no further, which is four squares in all from where it starts the game. If
        something is in the way it stops earlier and finishes the advance on a later turn.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Advance below rank 7
          </p>
          <Diagram
            subject='e3'
            pieces={[place(WHITE, LEGIONARY, 'e3', false)]}
            {...squares(occupancy => legionary(WHITE, occupancy, 'e3', true, [], null))}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The dots stop at rank 7 even though the file ahead is empty, so the first stretch never
        carries it past the middle rank.
      </p>
    </>
  )
}
function Push() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Once it stands on rank 7 or beyond, the limit is gone and a shorter step takes over. How
        long that step is depends on the zone it is in.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one or two squares forward each move.
          </p>
          <Diagram
            subject='e8'
            pieces={[
              place(WHITE, LEGIONARY, 'e8', true),
              place(WHITE, MARSHAL, COMMAND_SQUARE, false)
            ]}
            {...squares(occupancy =>
              legionary(
                WHITE,
                { ...occupancy, [COMMAND_SQUARE]: { side: WHITE, piece: MARSHAL } },
                'e8',
                true,
                [],
                null
              )
            )}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one square forward each move.
          </p>
          <Diagram
            subject='e8'
            pieces={[place(WHITE, LEGIONARY, 'e8', false)]}
            {...squares(occupancy => legionary(WHITE, occupancy, 'e8', false, [], null))}
          />
        </Zone>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Both boards start from the same square, so the enhanced zone gains a tempo, and either way
        capturing is one square diagonally forward like a pawn.
      </p>
    </>
  )
}
function Trigger() {
  return (
    <div className='rounded border border-line px-3.5 py-3'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
        White advances to e7
      </p>
      <Diagram
        subject='e3'
        pieces={[place(WHITE, LEGIONARY, 'e3', false), place(BLACK, LEGIONARY, 'd7', false)]}
        {...squares(occupancy =>
          legionary(
            WHITE,
            { ...occupancy, d7: { side: BLACK, piece: LEGIONARY } },
            'e3',
            true,
            [],
            null
          )
        )}
        captures={null}
      />
    </div>
  )
}
function EnPassant() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        En passant works here too, and only against one move: the advance that goes straight from a
        Legionary&apos;s own starting rank to rank 7. A Legionary attacking a square that advance
        crossed may capture it as though it had stopped one square short, on the move immediately
        following. An advance that begins anywhere else gives nothing.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Trigger />
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Black captures en passant
          </p>
          <Diagram
            subject='d7'
            pieces={[place(BLACK, LEGIONARY, 'd7', false), place(WHITE, LEGIONARY, 'e7', false)]}
            {...squares(occupancy =>
              legionary(
                BLACK,
                { ...occupancy, e7: { side: WHITE, piece: LEGIONARY } },
                'd7',
                false,
                [],
                { target: 'e6', captured: 'e7' }
              )
            )}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The right is gone the moment it is not used: play anything else and that square can no
        longer be captured.
      </p>
    </>
  )
}
export function Legionary() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Legionary</h3>
      <Counterpart from='pawn' to={LEGIONARY} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The pawn of this game. Forward only, never back, and anything in front of it holds it where
        it is.
      </p>
      <Advance />
      <Push />
      <EnPassant />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Legionary that reaches the last rank is exchanged for a piece your own side has already
        lost. The full rule is under Promotion.
      </p>
    </section>
  )
}