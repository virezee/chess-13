import Image from 'next/image'
import { WHITE } from '@/constants/player'
import { TEMPLAR } from '@/constants/piece'
import { templar } from '@/features/game/engine/moves/templar'
import { Diagram } from '../Diagram'

const PIECE = { square: 'g7', name: TEMPLAR }
const targets = (isEnhanced: boolean): string[] =>
  templar(WHITE, {}, PIECE.square, isEnhanced).map(move => move.to)

export function Templar() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Templar</h3>
      <div className='mt-4 flex select-none items-center justify-center gap-5'>
        <Image src='/white/knight.svg' alt='Knight' width={72} height={72} />
        <span className='text-[26px] leading-none text-ink-faint'>&rarr;</span>
        <Image src='/white/templar.png' alt='Templar' width={72} height={72} />
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The knight of this game. Every move is a jump, so the pieces in between do not matter, and
        the piece it lands on is the piece it takes.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-good/60 bg-good/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-good'>
            Enhanced
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Two jump shapes, three squares one way and two the other, or two squares one way and one
            the other, which is the knight jump of chess.
          </p>
          <Diagram piece={PIECE} moves={targets(true)} />
        </div>
        <div className='rounded border border-alert/60 bg-alert/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-alert'>
            Restricted
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            One jump shape only, three squares one way and two the other. The knight jump is gone.
          </p>
          <Diagram piece={PIECE} moves={targets(false)} />
        </div>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The jump it gains is the shorter one, so a restricted Templar always lands far from where it
        started.
      </p>
    </section>
  )
}