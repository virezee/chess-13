import Image from 'next/image'
import { SIZE, FILES, RANKS } from '@/constants/board'
import { WHITE } from '@/constants/player'
import { SENTINEL, MARSHAL } from '@/constants/piece'
import { sentinel } from '@/features/game/engine/moves/sentinel'
import { Diagram } from '../Diagram'

const PIECE = { square: 'a1', name: SENTINEL }
const MARSHAL_PIECE = { square: 'd1', name: MARSHAL }
const BUFFED = { ...PIECE, isBuffed: true }
const PIECES = [MARSHAL_PIECE]
const upward = (count: number): string[] => RANKS.slice(1, count + 1).map(rank => `a${rank}`)
const rightward = (count: number): string[] => FILES.slice(1, count + 1).map(file => `${file}1`)
const ENHANCED = [...upward(SIZE - 1), ...rightward(2)]
const RESTRICTED = [...upward(6), ...rightward(6)]
const targets = (isEnhanced: boolean): string[] =>
  sentinel(
    WHITE,
    isEnhanced ? { [MARSHAL_PIECE.square]: { side: WHITE, piece: MARSHAL } } : {},
    PIECE.square,
    MARSHAL_PIECE.square,
    isEnhanced
  ).map(move => move.to)
export function Sentinel() {
  return (
    <section>
      <h3 className='font-reading text-[18px] leading-none text-ink'>Sentinel</h3>
      <div className='mt-4 flex select-none items-center justify-center gap-5'>
        <Image src='/white/rook.svg' alt='Rook' width={72} height={72} />
        <span className='text-[26px] leading-none text-ink-faint'>&rarr;</span>
        <Image src='/white/sentinel.png' alt='Sentinel' width={72} height={72} />
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The rook of this game. Straight lines only, up, down, left and right, and the path has to be
        clear. What changes is how far it goes, and that depends on whether the move takes
        something.
      </p>
      <div className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:-mx-8 xl:-mx-24 2xl:-mx-32'>
        <div className='rounded border border-good/60 bg-good/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-good'>
            Enhanced
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Up to six squares on a quiet move, and no limit for capturing. It also passes through
            your own pieces when it moves towards your Marshal.
          </p>
          <Diagram piece={BUFFED} pieces={PIECES} moves={targets(true)} captures={ENHANCED} />
        </div>
        <div className='rounded border border-alert/60 bg-alert/10 px-3.5 py-3'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-alert'>
            Restricted
          </p>
          <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
            Up to three squares on a quiet move, up to six on a move that captures. Any piece blocks
            it, yours or theirs.
          </p>
          <Diagram piece={PIECE} moves={targets(false)} captures={RESTRICTED} />
        </div>
      </div>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Taking a piece reaches further than moving to an empty square, so an enemy piece far down
        the line can still be captured.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Move it towards your Marshal and it passes through your own pieces, landing on any free
        square after them. It never passes through theirs.
      </p>
    </section>
  )
}