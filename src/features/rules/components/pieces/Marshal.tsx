import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, SENTINEL, HERALD } from '@/constants/piece'
import { FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { BUFF, MARKS } from '@/constants/style'
import { marshal } from '@/features/game/engine/moves'
import { isEnhanced } from '@/features/game/engine/generate'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { place } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Range({ from, caption }: { from: string; caption: string }) {
  return (
    <div className='rounded border border-line px-3.5 py-3'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
        {caption}
      </p>
      <Diagram
        subject={null}
        pieces={[place(WHITE, MARSHAL, from, false)]}
        moves={null}
        captures={null}
        marks={{
          background: BUFF.white,
          clip: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          squares: FILES.flatMap(file => RANKS.map(rank => `${file}${rank}`)).filter(
            square => square !== from && isEnhanced(from, square)
          )
        }}
      />
    </div>
  )
}
function Command() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <Range from={COMMAND_SQUARE} caption='On the command square' />
      <Range from='f8' caption='Four squares in every direction' />
      <Range from='h1' caption='Against the edge' />
      <Range from='a1' caption='In a corner' />
    </div>
  )
}
function Lines() {
  return (
    <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Eight lines, any distance
        </p>
        <Diagram
          subject='g7'
          pieces={[place(WHITE, MARSHAL, 'g7', false)]}
          {...squares(occupancy => marshal(WHITE, occupancy, 'g7'))}
          captures={null}
        />
      </div>
    </div>
  )
}
function Capture() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Herald already attacks it
        </p>
        <Diagram
          subject='e4'
          pieces={[
            place(WHITE, MARSHAL, 'e4', false),
            place(WHITE, HERALD, 'b5', true),
            place(BLACK, SENTINEL, 'e8', false)
          ]}
          moves={marshal(
            WHITE,
            { b5: { side: WHITE, piece: HERALD }, e8: { side: BLACK, piece: SENTINEL } },
            'e4'
          )
            .filter(move => !move.captures)
            .map(move => move.to)
            .filter(square => square.startsWith('e') && Number(square.slice(1)) > 4)}
          captures={['e8']}
          arrows={[{ fill: MARKS.red, steps: [{ from: 'b5', to: 'e8' }] }]}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Nothing of yours attacks it
        </p>
        <Diagram
          subject='e4'
          pieces={[place(WHITE, MARSHAL, 'e4', false), place(BLACK, SENTINEL, 'e8', false)]}
          moves={marshal(
            WHITE,
            { b5: { side: WHITE, piece: HERALD }, e8: { side: BLACK, piece: SENTINEL } },
            'e4'
          )
            .filter(move => !move.captures)
            .map(move => move.to)
            .filter(square => square.startsWith('e') && Number(square.slice(1)) > 4)}
          captures={null}
        />
      </div>
    </div>
  )
}
export function Marshal() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Marshal</h3>
      <Counterpart from={null} to={MARSHAL} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The piece your whole army depends on. It is what turns your other pieces enhanced, and what
        it can capture depends on the rest of your army.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Each of your pieces looks at where your Marshal stands to know which version of itself it
        is. On the command square it enhances your whole army at once, wherever the pieces are.
        Anywhere else it enhances only what stands within four squares of it, sideways, up and down
        or diagonally, and everything further out is restricted.
      </p>
      <Command />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The zone is a square block, and the edge of the board cuts whatever falls outside it, so the
        same Marshal covers far fewer pieces from a corner than from the middle.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Moving is the easy half: any distance along a rank, a file or a diagonal, for as long as the
        path in front of it is clear.
      </p>
      <Lines />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Nothing holds it back here, and no square is out of reach on an open board. Every limit it
        has falls on the capture instead.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Capturing is the half that is held back. The Marshal only takes a piece one of your other
        pieces is already attacking, and without that the capture is simply not available.
      </p>
      <Capture />
    </section>
  )
}