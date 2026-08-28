export function Notice() {
  return (
    <section className='rounded border border-brass/45 bg-brass/8 px-4 py-3.5'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-brass'>
        Read this first
      </p>
      <p className='mt-2 text-[15px] leading-relaxed text-ink-dim'>
        <span className='font-semibold text-ink'>
          You should know normal chess before you start.
        </span>{' '}
        This page does not teach you what check means, how a rook moves, or why castling exists. It
        only tells you what is different here, and it does that on almost every line.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        If chess is new to you, go and learn that first. An hour with any beginner guide is enough.
        Come back after that and this page turns into a short list of differences instead of
        something you have to decode.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        If you already play, take it slowly anyway. There is a lot here. Read the command square
        part twice, because everything after it depends on it. And do not try to hold all of it at
        once. Most people come back to this page during their first few games, and that is normal.
      </p>
    </section>
  )
}