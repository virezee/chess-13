import Image from 'next/image'
import { WHITE } from '@/constants/player'
import { HERALD } from '@/constants/piece'
import { herald } from '@/features/game/engine/moves/herald'
import { Diagram } from '../Diagram'

const PIECE = { square: 'c3', name: HERALD }
const targets = (isEnhanced: boolean): string[] =>
  herald(WHITE, {}, PIECE.square, isEnhanced).map(move => move.to)

export function Herald() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Herald</h3>
      <div className='mt-4 flex select-none items-center justify-center gap-5'>
        <Image src='/white/bishop.svg' alt='Bishop' width={72} height={72} />
        <span className='text-[26px] leading-none text-ink-faint'>&rarr;</span>
        <Image src='/white/herald.png' alt='Herald' width={72} height={72} />
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The bishop of this game, with one extra move: a single step straight up, down, left or
        right. That step is what lets it change square colour, so it is not stuck on one colour for
        the whole game the way a bishop is.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-good/60 bg-good/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-good'>
            Enhanced
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Diagonals with no limit, for moving and for capturing. The straight step can capture as
            well.
          </p>
          <Diagram piece={PIECE} moves={targets(true)} captures={['b3', 'c2', 'c4', 'd3']} />
        </div>
        <div className='rounded border border-alert/60 bg-alert/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-alert'>
            Restricted
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Diagonals up to six squares, for moving and for capturing. The straight step is still
            there, but it cannot capture.
          </p>
          <Diagram piece={PIECE} moves={targets(false)} />
        </div>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Its diagonal reach is the same whether it is moving to an empty square or taking a piece.
      </p>
    </section>
  )
}