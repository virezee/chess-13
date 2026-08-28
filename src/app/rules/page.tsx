import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rules'
}
export default function Rules() {
  return (
    <main className='mx-auto flex w-full max-w-220 flex-1 select-text flex-col gap-4 px-4 py-5 font-reading xl:px-5'>
      <header>
        <h1 className='font-display text-[28px] leading-none text-ink'>Rules</h1>
        <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
          Welcome to Chess 13: Epoch. It is chess on a bigger board, with new pieces and one new
          idea that runs through all of them.
        </p>
        <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
          The board is 13 by 13, only two pieces move the way you already know, the king and the
          queen, and every piece in your army has two versions, enhanced and restricted, decided by
          where it stands. That last one takes the longest to get used to. Underneath it is still
          chess. You still have a king to protect, you still win by checkmate, and pawns still
          promote.
        </p>
        <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
          Everything you need is on this page, in the order you need it. First the board, then the
          command zone, then each piece on its own, then promotion, then the ways a game ends.
        </p>
      </header>
      <section className='rounded border border-brass/45 bg-brass/8 px-4 py-3.5'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-brass'>
          Read this first
        </p>
        <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
          <span className='font-semibold text-ink'>
            You should know normal chess before you start.
          </span>{' '}
          This page does not teach you what check means, how a rook moves, or why castling exists.
          It only tells you what is different here, and it does that on almost every line.
        </p>
        <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
          If chess is new to you, go and learn that first. An hour with any beginner guide is
          enough. Come back after that and this page turns into a short list of differences instead
          of something you have to decode.
        </p>
        <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
          If you already play, take it slowly anyway. There is a lot here. Read the command zone
          part twice, because everything after it depends on it. And do not try to hold all of it at
          once. Most people come back to this page during their first few games, and that is normal.
        </p>
      </section>
    </main>
  )
}