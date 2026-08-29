import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, LEGIONARY } from '@/constants/piece'
import { COMMAND_SQUARE } from '@/constants/board'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { place } from '../../lib/occupant'
import { legionaryAdvance, legionaryStep } from '../../lib/reach'

function Advance() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Rank 7 is the middle rank. Below it a Legionary moves straight forward to any empty square
        up to rank 7 and no further, which is a run of four squares from where it starts the game.
        If something is in the way it stops earlier and finishes the run on a later turn.
      </p>
      <Diagram
        piece={place(WHITE, LEGIONARY, 'e3', false)}
        pieces={null}
        moves={legionaryAdvance(true)}
        captures={['d4', 'f4']}
      />
    </>
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
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            White runs to e7
          </p>
          <Diagram
            piece={place(WHITE, LEGIONARY, 'e3', false)}
            pieces={[place(BLACK, LEGIONARY, 'd7', false)]}
            moves={legionaryAdvance(true)}
            captures={null}
          />
        </div>
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Black answers on e6
          </p>
          <Diagram
            piece={place(BLACK, LEGIONARY, 'd7', false)}
            pieces={[place(WHITE, LEGIONARY, 'e7', false)]}
            moves={['d6']}
            captures={['e6']}
          />
        </div>
      </div>
    </>
  )
}
export function Legionary() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Legionary</h3>
      <Counterpart from='pawn' to={LEGIONARY} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The pawn of this game. Forward only, never back, and it never jumps, so anything in front of
        it stops it.
      </p>
      <Advance />
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Zone isEnhanced>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one or two squares forward each move.
          </p>
          <Diagram
            piece={place(WHITE, LEGIONARY, 'e8', true)}
            pieces={[place(WHITE, MARSHAL, COMMAND_SQUARE, false)]}
            moves={legionaryStep(true)}
            captures={['d9', 'f9']}
          />
        </Zone>
        <Zone isEnhanced={false}>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one square forward each move.
          </p>
          <Diagram
            piece={place(WHITE, LEGIONARY, 'e8', false)}
            pieces={null}
            moves={legionaryStep(false)}
            captures={['d9', 'f9']}
          />
        </Zone>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Taking is done one square diagonally forward, the same as a pawn.
      </p>
      <EnPassant />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Legionary that reaches the last rank is exchanged for a piece your own side has already
        lost. The full rule is under Promotion.
      </p>
    </section>
  )
}