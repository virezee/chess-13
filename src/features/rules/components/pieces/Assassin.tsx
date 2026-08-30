import { WHITE, BLACK } from '@/constants/player'
import { MARSHAL, ASSASSIN, SENTINEL, HERALD } from '@/constants/piece'
import { MARKS } from '@/constants/style'
import { ASSASSIN_CAPTURES, ASSASSIN_OCCUPIED, ASSASSIN_ATTACKED } from '../constants/scene'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Zone } from './Zone'
import { assassin } from '@/features/game/engine/moves'
import { place, occupy } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Enhanced() {
  return (
    <Zone isEnhanced>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        The line has no limit. It moves as far along it as the path stays clear, and it takes a
        piece standing anywhere on that same line.
      </p>
      <Diagram
        subject='c3'
        pieces={[place(WHITE, ASSASSIN, 'c3', true), place(WHITE, MARSHAL, 'e4', false)]}
        {...squares(occupancy =>
          assassin(WHITE, { ...occupancy, e4: { side: WHITE, piece: MARSHAL } }, 'c3', true)
        )}
        captures={null}
      />
      <Diagram
        subject='c3'
        pieces={[
          place(WHITE, ASSASSIN, 'c3', true),
          place(WHITE, MARSHAL, 'e4', false),
          ...ASSASSIN_CAPTURES
        ]}
        {...squares(occupancy =>
          assassin(
            WHITE,
            {
              ...occupancy,
              ...occupy(ASSASSIN_CAPTURES),
              e4: { side: WHITE, piece: MARSHAL }
            },
            'c3',
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
        The line is cut to six squares. It moves up to six, and it takes only a piece close enough
        that the whole capture stays inside those six.
      </p>
      <Diagram
        subject='c3'
        pieces={[place(WHITE, ASSASSIN, 'c3', false)]}
        {...squares(occupancy => assassin(WHITE, occupancy, 'c3', false))}
        captures={null}
      />
      <Diagram
        subject='c3'
        pieces={[place(WHITE, ASSASSIN, 'c3', false), ...ASSASSIN_CAPTURES]}
        {...squares(occupancy =>
          assassin(WHITE, { ...occupancy, ...occupy(ASSASSIN_CAPTURES) }, 'c3', false)
        )}
      />
    </Zone>
  )
}
function Illegal() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The square behind is occupied
        </p>
        <Diagram
          subject='c3'
          pieces={[place(WHITE, ASSASSIN, 'c3', false), ...ASSASSIN_OCCUPIED]}
          moves={null}
          captures={null}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The square behind is attacked by the opponent
        </p>
        <Diagram
          subject='c3'
          pieces={[place(WHITE, ASSASSIN, 'c3', false), ...ASSASSIN_ATTACKED]}
          moves={null}
          captures={['c8']}
          arrows={[
            { fill: MARKS.red, steps: [{ from: 'c3', to: 'c7' }] },
            { fill: MARKS.blue, steps: [{ from: 'e6', to: 'c8' }] }
          ]}
        />
      </div>
    </div>
  )
}
function Corner() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Capturing on a corner
        </p>
        <Diagram
          subject='c3'
          pieces={[place(WHITE, ASSASSIN, 'c3', false), place(BLACK, SENTINEL, 'a1', false)]}
          moves={null}
          captures={['a1']}
          arrows={[{ fill: MARKS.red, steps: [{ from: 'c3', to: 'a1' }] }]}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The capture is not allowed
        </p>
        <Diagram
          subject='c3'
          pieces={[
            place(WHITE, ASSASSIN, 'c3', false),
            place(BLACK, HERALD, 'a1', false),
            place(BLACK, SENTINEL, 'a5', false)
          ]}
          moves={null}
          captures={null}
          arrows={[{ fill: MARKS.blue, steps: [{ from: 'a5', to: 'a1' }] }]}
        />
      </div>
    </div>
  )
}
export function Assassin() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Assassin</h3>
      <Counterpart from={null} to={ASSASSIN} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        It travels the same eight directions as a queen, straight and diagonal, and the path has to
        be clear. What is different is the capture: an Assassin never ends on the square of the
        piece it takes. It passes over that piece and lands on the square immediately beyond, and
        the piece it passed over is taken where it stood.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Enhanced />
        <Restricted />
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        When it takes, the square behind the piece must be empty and must not be attacked. Any piece
        standing there, of either colour, stops the capture, and so does an opponent&apos;s piece
        attacking that square. Moving without taking is not bound by this: an Assassin walks its
        lines like any other piece. It takes one piece a move, and only where nothing can take it
        back.
      </p>
      <Illegal />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Where the board ends there is no square behind, so a piece on the far rank cannot be taken
        from in front, and the Assassin has to come at it from another direction. The corners are
        the exception, having nothing behind them at all: a piece on a corner is taken the ordinary
        way, with the Assassin ending on the corner, which still must not be attacked.
      </p>
      <Corner />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        On a corner the square it takes on and the square it lands on are the same, so that one
        square carries both conditions at once.
      </p>
    </section>
  )
}