import { WHITE, BLACK } from '@/constants/player'
import { EMPEROR, MARSHAL, ASSASSIN, SENTINEL, MAGE, LEGIONARY } from '@/constants/piece'
import { EMPEROR_FLAG, EMPEROR_EN_PRISE } from '../../constants/scene'
import { emperor } from '@/features/game/engine/moves'
import { Diagram } from '../Diagram'
import { Counterpart } from './Counterpart'
import { Animation } from './Animation'
import { place } from '../../lib/occupant'
import { squares } from '../../lib/reach'

function Attacked() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Two things bring it into play: your Marshal is captured, or the Emperor stands under attack
        when your turn begins. Only the start of your turn counts, so an attack that comes and goes
        during the opponent&apos;s turn changes nothing. Once it is in play it stays that way for
        the rest of the game, and a new Marshal does not make it dormant again.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto sm:w-[calc(50%-0.3125rem)]'>
          <Animation
            caption='The attack arrives down the file'
            subject='g2'
            pieces={[
              place(WHITE, EMPEROR, 'g2', false),
              place(BLACK, SENTINEL, 'd12', true),
              place(BLACK, MARSHAL, 'h12', false)
            ]}
            move={{ from: 'd12', to: 'g12' }}
            trace={EMPEROR_FLAG}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Which piece does it changes nothing. A leap from a Templar, a diagonal, the ring of a Mage,
        any of them counts, and what decides is only whether the square is attacked when your turn
        opens.
      </p>
    </>
  )
}
function DiscoveredAttack() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        You can open the line yourself. Move one of your own pieces off it and an enemy line falls
        on your Emperor, a discovered attack you set up against your own piece. It costs you a move,
        and the opponent chooses: withdraw the attacker, or leave it standing with a defender behind
        it, so your Emperor comes into play already attacked and has to move or be captured.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <Animation
          caption='Your own Mage steps off the line'
          subject='g2'
          pieces={[
            place(WHITE, EMPEROR, 'g2', false),
            place(WHITE, MAGE, 'g3', false),
            place(BLACK, SENTINEL, 'g12', true),
            place(BLACK, MARSHAL, 'h12', false)
          ]}
          move={{ from: 'g3', to: 'i3' }}
          trace={null}
        />
        <Animation
          caption='The Marshal steps down and the line still holds'
          subject='g2'
          pieces={[
            place(WHITE, EMPEROR, 'g2', false),
            place(WHITE, MAGE, 'i3', false),
            place(BLACK, SENTINEL, 'g12', true),
            place(BLACK, MARSHAL, 'h12', false)
          ]}
          move={{ from: 'h12', to: 'h11' }}
          trace={EMPEROR_FLAG}
        />
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Opening the line on your own move settles nothing, because the reading waits for your turn
        to start. What counts is the attack still standing after the opponent has moved. Coming into
        play is not the same as being safe, since it arrives with that line still aimed at it.
      </p>
    </>
  )
}
function AssassinCapture() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A dormant Emperor guards nothing, so the square in front of it reads as free and an Assassin
        may take a piece there. The same landing leaves the Emperor under attack, and once your turn
        opens it is in play and can capture the Assassin where it stands.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto sm:w-[calc(50%-0.3125rem)]'>
          <Animation
            caption='The Assassin lands on the line to the Emperor'
            subject='g2'
            pieces={[
              place(WHITE, EMPEROR, 'g2', false),
              place(WHITE, LEGIONARY, 'k7', false),
              place(BLACK, ASSASSIN, 'k11', false)
            ]}
            move={{ from: 'k11', to: 'k6', captures: ['k7'] }}
            trace={EMPEROR_EN_PRISE}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The capture was legal when it was played, and it is the Assassin&apos;s own arrival that
        opened the line to it.
      </p>
    </>
  )
}
export function Emperor() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Emperor</h3>
      <Counterpart from='queen' to={EMPEROR} />
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The queen of this game. It travels along a rank, a file or a diagonal as far as the line is
        open, and captures the first enemy piece on that line. The Marshal&apos;s zone does not
        touch it, so it plays the same everywhere on the board.
      </p>
      <div className='mt-3 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='mx-auto rounded border border-line px-3.5 py-3 sm:w-[calc(50%-0.3125rem)]'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
            Every line, any distance
          </p>
          <Diagram
            subject='g7'
            pieces={[place(WHITE, EMPEROR, 'g7', false)]}
            {...squares(occupancy =>
              emperor(
                WHITE,
                { ...occupancy, g7: { side: WHITE, piece: EMPEROR, awake: true } },
                'g7'
              )
            )}
          />
        </div>
      </div>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Every square it can move to is a square it can capture on, so the only thing that shortens a
        line is a piece standing in it.
      </p>
      <h4 className='mt-6 font-reading text-[14px] leading-none text-ink'>Dormancy</h4>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The Emperor does not start the game in play. While your Marshal is alive it stands dormant:
        it cannot move, it cannot capture, it guards nothing, and nothing on the board can remove
        it, a blast included. It still fills its square, so a line behind it stays closed.
      </p>
      <Attacked />
      <DiscoveredAttack />
      <AssassinCapture />
    </section>
  )
}