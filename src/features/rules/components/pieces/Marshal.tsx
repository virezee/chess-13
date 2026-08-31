// oxlint-disable import/max-dependencies
// oxlint-disable eslint/max-lines
import { WHITE, BLACK } from '@/constants/player'
import {
  POPE,
  MARSHAL,
  ASSASSIN,
  SENTINEL,
  MAGE,
  HERALD,
  TEMPLAR,
  LEGIONARY
} from '@/constants/piece'
import { FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { BUFF, MARKS } from '@/constants/style'
import { RIPOSTE_FLAG, EN_PRISE_FLAG } from '../../constants/scene'
import { marshal } from '@/features/game/engine/moves'
import { isEnhanced } from '@/features/game/engine/generate'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Animation } from './Animation'
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
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Each of your pieces looks at where your Marshal stands to know which version of itself it
        is. On the command square it enhances your whole army at once, wherever the pieces are.
        Anywhere else it enhances only what stands within four squares of it, sideways, up and down
        or diagonally, and everything further out is restricted.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Range from={COMMAND_SQUARE} caption='On the command square' />
        <Range from='f8' caption='Four squares in every direction' />
        <Range from='h1' caption='Against the edge' />
        <Range from='a1' caption='In a corner' />
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The zone is a square block, and the edge of the board cuts whatever falls outside it, so the
        same Marshal covers far fewer pieces from a corner than from the middle.
      </p>
    </>
  )
}
function Lines() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Moving is the easy half: any distance along a rank, a file or a diagonal, for as long as the
        path in front of it is clear.
      </p>
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
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Nothing holds it back here, and no square is out of reach on an open board. Every limit it
        has falls on the capture instead.
      </p>
    </>
  )
}
function CaptureDiagram() {
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
function Capture() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Capturing is the half that is held back. The Marshal only captures a piece one of your other
        pieces is already attacking, and without that the capture is simply not available.
      </p>
      <CaptureDiagram />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The line to the Sentinel is the same either way. What decides the capture is whether
        anything else of yours is aiming at that square.
      </p>
    </>
  )
}
function Adjacent() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The Mage and the Assassin are the hard ones to read. Both attack in their own way, and it
        takes a second look to tell whether a piece is attacked by them. In the two positions here
        it is, so the Marshal may capture.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            The Mage attacks everything next to it
          </p>
          <Diagram
            subject='g1'
            pieces={[
              place(WHITE, MARSHAL, 'g1', false),
              place(WHITE, MAGE, 'h12', false),
              place(BLACK, HERALD, 'g12', false)
            ]}
            moves={null}
            captures={['g12']}
            marks={{ background: MARKS.red, squares: ['g12'] }}
            arrows={[{ fill: MARKS.red, steps: [{ from: 'g1', to: 'g12' }] }]}
          />
        </div>
        <div className='rounded border border-line px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            The Marshal can capture what the Mage cannot blast
          </p>
          <Diagram
            subject='g1'
            pieces={[
              place(WHITE, MARSHAL, 'g1', false),
              place(WHITE, MAGE, 'h12', false),
              place(WHITE, POPE, 'i12', false),
              place(BLACK, HERALD, 'g12', false)
            ]}
            moves={null}
            captures={['g12']}
            arrows={[{ fill: MARKS.red, steps: [{ from: 'g1', to: 'g12' }] }]}
          />
        </div>
      </div>
    </>
  )
}
function ArrivalDiagram() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Marshal can capture, the square behind is only attacked
        </p>
        <Diagram
          subject='m7'
          pieces={[
            place(WHITE, MARSHAL, 'm7', false),
            place(WHITE, ASSASSIN, 'c3', false),
            place(BLACK, LEGIONARY, 'c7', false),
            place(BLACK, TEMPLAR, 'f10', false)
          ]}
          moves={null}
          captures={['c7']}
          arrows={[
            {
              fill: MARKS.red,
              steps: [
                { from: 'm7', to: 'c7' },
                { from: 'c3', to: 'c7' }
              ]
            },
            { fill: MARKS.blue, steps: [{ from: 'f10', to: 'c8' }] }
          ]}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Marshal cannot capture, the square behind is occupied
        </p>
        <Diagram
          subject='m7'
          pieces={[
            place(WHITE, MARSHAL, 'm7', false),
            place(WHITE, ASSASSIN, 'c3', false),
            place(BLACK, LEGIONARY, 'c7', false),
            place(BLACK, TEMPLAR, 'c8', false)
          ]}
          moves={null}
          captures={null}
        />
      </div>
    </div>
  )
}
function Arrival() {
  return (
    <>
      <ArrivalDiagram />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Mage attacks every square around it, so anything next to it is open to the Marshal.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        An Assassin attacks along its line as soon as the square behind the piece is empty. If that
        square is attacked, the Marshal can still captures and the Assassin cannot: that is the
        Assassin&apos;s own problem. If the square is occupied there is no attack, and neither of
        them can capture.
      </p>
    </>
  )
}
function Riposte() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The Marshal has one special right of its own. Lose a piece on a square it has a clear line
        to, and for one move it captures on those lines with nothing of yours attacking the piece.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Watch the square the piece falls on. The Marshal sweeps its eight lines outward, and the
        capture only counts if that square is one of them. Anything standing in between, yours or
        the opponent&apos;s, cuts the line short and no right appears.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Animation
          caption='The capture triggers the riposte'
          subject='g5'
          pieces={[
            place(WHITE, MARSHAL, 'g5', false),
            place(BLACK, SENTINEL, 'm10', false),
            place(WHITE, LEGIONARY, 'l10', false)
          ]}
          move={{ from: 'm10', to: 'l10', captures: ['l10'] }}
          trace={RIPOSTE_FLAG}
        />
        <Animation
          caption='The capture does not trigger the riposte'
          subject='g5'
          pieces={[
            place(WHITE, MARSHAL, 'g5', false),
            place(WHITE, HERALD, 'k9', true),
            place(BLACK, SENTINEL, 'm10', false),
            place(WHITE, LEGIONARY, 'l10', false)
          ]}
          move={{ from: 'm10', to: 'l10', captures: ['l10'] }}
          trace={null}
        />
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The capture is the same on both, and so is the diagonal it happened on. All that changes is
        whether the Marshal&apos;s path to that square is open.
      </p>
    </>
  )
}
function SelfCapture() {
  return (
    <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='mx-auto sm:w-[calc(50%-0.3125rem)]'>
        <Animation
          caption='The Mage blasts its own pieces along with the enemy'
          subject='c7'
          pieces={[
            place(WHITE, MARSHAL, 'm7', false),
            place(WHITE, MAGE, 'c7', false),
            place(WHITE, LEGIONARY, 'd7', false),
            place(WHITE, TEMPLAR, 'b8', false),
            place(BLACK, SENTINEL, 'd6', false),
            place(BLACK, HERALD, 'b7', false),
            place(BLACK, LEGIONARY, 'c8', false)
          ]}
          move={{ from: 'c7', to: 'c7', captures: ['d7', 'b8', 'd6', 'b7', 'c8'] }}
          trace={null}
        />
      </div>
    </div>
  )
}
function EnPrise() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The riposte is not always triggered. A Mage that kills your own piece in its ring gives you
        nothing, since only a capture by the opponent creates the right. Anything standing between
        the Marshal and the square where your piece died cuts the line as well, and an Assassin that
        lands there does that to itself.
      </p>
      <SelfCapture />
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Animation
          caption='The Assassin lands on the line and cuts it'
          subject='l7'
          pieces={[
            place(WHITE, MARSHAL, 'l7', false),
            place(BLACK, ASSASSIN, 'a7', false),
            place(WHITE, LEGIONARY, 'c7', false)
          ]}
          move={{ from: 'a7', to: 'd7', captures: ['c7'] }}
          trace={null}
        />
        <Animation
          caption='The Assassin lands where the Marshal can take it'
          subject='g7'
          pieces={[
            place(WHITE, MARSHAL, 'g7', false),
            place(BLACK, ASSASSIN, 'a3', false),
            place(WHITE, LEGIONARY, 'f8', true)
          ]}
          move={{ from: 'a3', to: 'g9', captures: ['f8'] }}
          trace={EN_PRISE_FLAG}
        />
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Mage blasting its own never opens a riposte, whatever the Marshal sees. The Assassin is
        safe only when it blocks the Marshal&apos;s path to the square where the capture happened.
        If it does not, the Marshal may take it, and this is the one time an Assassin can be
        captured right after capturing, since the riposte creates an attack the landing square did
        not have before.
      </p>
    </>
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
      <Command />
      <Lines />
      <Capture />
      <Adjacent />
      <Arrival />
      <h4 className='mt-6 font-reading text-[14px] leading-none text-ink'>Riposte</h4>
      <Riposte />
      <EnPrise />
    </section>
  )
}