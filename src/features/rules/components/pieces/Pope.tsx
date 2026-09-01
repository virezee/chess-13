import { WHITE, BLACK } from '@/constants/player'
import { POPE, MARSHAL, ASSASSIN, SENTINEL, MAGE } from '@/constants/piece'
import { CHECK, MARKS } from '@/constants/style'
import { pope } from '@/features/game/engine/moves'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { place } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Castling() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Castling works as it does in chess, except the partner is a Sentinel and the Pope travels
        three files instead of two. It is one move, to the left or to the right. Neither piece may
        have moved earlier, every square between them has to be empty, and the Pope may not start,
        cross or finish on a square the opponent attacks.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Where castling puts the Pope
          </p>
          <Diagram
            subject='g1'
            pieces={[
              place(WHITE, POPE, 'g1', false),
              place(WHITE, SENTINEL, 'a1', false),
              place(WHITE, SENTINEL, 'm1', false)
            ]}
            moves={pope(
              WHITE,
              { a1: { side: WHITE, piece: SENTINEL }, m1: { side: WHITE, piece: SENTINEL } },
              'g1',
              { left: true, right: true }
            )
              .filter(move => move.sentinel)
              .map(move => move.to)}
            captures={null}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The two dots stand three files out from the Pope, and each Sentinel finishes on a square the
        Pope crossed on its way there, e1 on the left and i1 on the right.
      </p>
    </>
  )
}
function BlastDiagram() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Mage stands next to the Pope
        </p>
        <Diagram
          subject='h7'
          pieces={[place(WHITE, POPE, 'g7', false), place(BLACK, MAGE, 'h7', false)]}
          moves={null}
          captures={null}
          marks={{ background: CHECK, squares: ['g7'] }}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Its own Pope shares the ring
        </p>
        <Diagram
          subject='h7'
          pieces={[
            place(WHITE, POPE, 'g7', false),
            place(BLACK, MAGE, 'h7', false),
            place(BLACK, POPE, 'i7', false)
          ]}
          moves={null}
          captures={null}
        />
      </div>
    </div>
  )
}
function EnhancedBlastDiagram() {
  return (
    <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Marshal turns the Mage enhanced
        </p>
        <Diagram
          subject='h7'
          pieces={[
            place(WHITE, POPE, 'g7', false),
            place(BLACK, MAGE, 'h7', true),
            place(BLACK, POPE, 'i7', false),
            place(BLACK, MARSHAL, 'i8', false)
          ]}
          moves={null}
          captures={null}
          marks={{ background: CHECK, squares: ['g7'] }}
        />
      </div>
    </div>
  )
}
function Mage() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Mage never captures by moving, so the check is the square it stands on. Next to the Pope
        is already check, since the blast on its next turn takes it where it stands. A restricted
        Mage with its own Pope in the same ring gives none, because that blast is not allowed and
        nothing is threatened.
      </p>
      <BlastDiagram />
      <EnhancedBlastDiagram />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The Mage stands on the same square in all three. What decides is whether its own Pope shares
        the ring, since the blast that would deliver the check is the blast it is forbidden to play.
        Bring the Marshal close and the Mage is enhanced, so the blast passes over its own Pope and
        the check stands again.
      </p>
    </>
  )
}
function ArrivalDiagram() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The square behind the Pope is occupied
        </p>
        <Diagram
          subject='c7'
          pieces={[
            place(BLACK, ASSASSIN, 'c7', false),
            place(WHITE, POPE, 'g7', false),
            place(WHITE, SENTINEL, 'h7', false)
          ]}
          moves={null}
          captures={null}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The square behind the Pope is attacked
        </p>
        <Diagram
          subject='c7'
          pieces={[
            place(BLACK, ASSASSIN, 'c7', false),
            place(WHITE, POPE, 'g7', false),
            place(WHITE, SENTINEL, 'h10', false)
          ]}
          moves={null}
          captures={['h7']}
          arrows={[
            { fill: MARKS.red, steps: [{ from: 'c7', to: 'g7' }] },
            { fill: MARKS.blue, steps: [{ from: 'h10', to: 'h7' }] }
          ]}
        />
      </div>
    </div>
  )
}
function EdgeDiagram() {
  return (
    <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Pope stands on the far rank
        </p>
        <Diagram
          subject='g9'
          pieces={[place(BLACK, ASSASSIN, 'g9', false), place(WHITE, POPE, 'g13', false)]}
          moves={null}
          captures={null}
        />
      </div>
      <div className='rounded border border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          The Pope stands on a corner
        </p>
        <Diagram
          subject='d4'
          pieces={[place(BLACK, ASSASSIN, 'd4', false), place(WHITE, POPE, 'a1', false)]}
          moves={null}
          captures={['a1']}
          marks={{ background: CHECK, squares: ['a1'] }}
          arrows={[{ fill: MARKS.red, steps: [{ from: 'd4', to: 'a1' }] }]}
        />
      </div>
    </div>
  )
}
function Assassin() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        For the Assassin the check is on the square behind the Pope. There is none if that square is
        occupied, or if the Pope&apos;s side attacks that square, and on the far rank there is no
        square behind at all. Only on a corner does it land where the Pope stands.
      </p>
      <ArrivalDiagram />
      <EdgeDiagram />
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        What decides the check is the square behind the Pope, never the line the Assassin stands on.
        As long as that square is empty and the Pope&apos;s side does not attack it, an Assassin far
        down the line threatens as much as one standing beside the Pope. Only the corner asks for no
        square behind at all, and there the Assassin ends where the Pope stood.
      </p>
    </>
  )
}
function Marshal() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The Marshal is the opposite case. Against an ordinary piece it captures only what one of its
        own pieces already attacks, but the Pope is exempt, so a clear line to it is already check.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            The Marshal checks on its own
          </p>
          <Diagram
            subject='c7'
            pieces={[place(BLACK, MARSHAL, 'c7', false), place(WHITE, POPE, 'g7', false)]}
            moves={null}
            captures={null}
            marks={{ background: CHECK, squares: ['g7'] }}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The Marshal has no second attacker on the board and the Pope is attacked all the same. The
        Pope has to step off the line, something has to block it, or the Marshal has to be captured.
      </p>
    </>
  )
}
function Check() {
  return (
    <>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Check works as it does in chess. A piece attacks the Pope, and the reply has to answer it.
        Three pieces are read differently, the Mage, the Assassin and the Marshal, since each of
        them attacks on terms of its own.
      </p>
      <Mage />
      <Assassin />
      <Marshal />
    </>
  )
}
export function Pope() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Pope</h3>
      <Counterpart from='king' to={POPE} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The king of this game. One square in any of the eight directions, and it captures the same
        way. The Marshal&apos;s zone does not affect it, so it plays the same wherever it stands. It
        is the piece the game ends on, so it is never traded and may never be left under attack.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            One square in every direction
          </p>
          <Diagram
            subject='g7'
            pieces={[place(WHITE, POPE, 'g7', false)]}
            {...squares(occupancy => pope(WHITE, occupancy, 'g7', { left: false, right: false }))}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The eight squares around it are its whole reach, and each one is open to a quiet move and to
        a capture alike.
      </p>
      <h4 className='mt-6 font-reading text-[14px] leading-none text-ink'>Castling</h4>
      <Castling />
      <h4 className='mt-6 font-reading text-[14px] leading-none text-ink'>Check</h4>
      <Check />
    </section>
  )
}