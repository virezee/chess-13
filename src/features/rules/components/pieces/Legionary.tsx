import Image from 'next/image'
import { WHITE, BLACK } from '@/constants/player'
import { COMMAND_SQUARE } from '@/constants/board'
import { LEGIONARY, MARSHAL } from '@/constants/piece'
import { legionary } from '@/features/game/engine/moves/legionary'
import { Diagram } from '../Diagram'

const START = { square: 'e3', name: LEGIONARY }
const PAST = { square: 'e8', name: LEGIONARY }
const BUFFED = { ...PAST, isBuffed: true }
const PIECES = [{ square: COMMAND_SQUARE, name: MARSHAL }]
const TAKER = { square: 'd7', name: LEGIONARY, side: BLACK } as const
const ARRIVED = [{ square: 'e7', name: LEGIONARY }]
const RUN_TAKES = ['d4', 'f4']
const STEP_TAKES = ['d9', 'f9']
const targets = (piece: { square: string }, isEnhanced: boolean): string[] =>
  legionary(WHITE, {}, piece.square, isEnhanced, [], null).map(move => move.to)

function Run() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Rank 7 is the middle rank. Below it a Legionary moves straight forward to any empty square
        up to rank 7 and no further, which is a run of four squares from where it starts the game.
        If something is in the way it stops earlier and finishes the run on a later turn.
      </p>
      <Diagram piece={START} moves={targets(START, true)} captures={RUN_TAKES} />
    </>
  )
}
function EnPassant() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        En passant works here too. A Legionary attacking a square crossed by an enemy Legionary that
        has just run the full four squares onto rank 7 may capture it as though it had stopped one
        square short. The capture is legal only on the move immediately following that run.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            White runs to e7
          </p>
          <Diagram piece={START} pieces={[TAKER]} moves={targets(START, true)} />
        </div>
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Black answers on e6
          </p>
          <Diagram piece={TAKER} pieces={ARRIVED} moves={['d6', 'e6']} captures={['e6']} />
        </div>
      </div>
    </>
  )
}
export function Legionary() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Legionary</h3>
      <div className='mt-4 flex select-none items-center justify-center gap-5'>
        <Image src='/white/pawn.svg' alt='Pawn' width={72} height={72} />
        <span className='text-[26px] leading-none text-ink-faint'>&rarr;</span>
        <Image src='/white/legionary.png' alt='Legionary' width={72} height={72} />
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The pawn of this game. Forward only, never back, and it never jumps, so anything in front of
        it stops it.
      </p>
      <Run />
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-good/60 bg-good/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-good'>
            Enhanced
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one or two squares forward each move.
          </p>
          <Diagram
            piece={BUFFED}
            pieces={PIECES}
            moves={targets(PAST, true)}
            captures={STEP_TAKES}
          />
        </div>
        <div className='rounded border border-alert/60 bg-alert/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-alert'>
            Restricted
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            From rank 7 onward, one square forward each move.
          </p>
          <Diagram piece={PAST} moves={targets(PAST, false)} captures={STEP_TAKES} />
        </div>
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