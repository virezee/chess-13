import { Diagram } from './Diagram'

export function Board() {
  return (
    <section>
      <h2 className='font-reading text-[22px] leading-none text-ink'>The Board</h2>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        Thirteen squares wide and thirteen deep. Files run a to m, ranks run 1 to 13. Each side owns
        26 pieces: a full back rank of nine kinds, and thirteen Legionaries in front of it.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Your back rank is rank 1, your Legionaries stand on rank 3, and rank 2 sits empty between
        them. Black is the mirror of that, on ranks 13 and 11.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Because 13 is odd there is a true middle rank, rank 7, and both sides are six ranks away
        from it. Legionaries cannot walk past it in one move, so that is where the two armies first
        meet. The square in the middle of it, g7, is worth remembering. It is the command square,
        and the next section is about what standing there does.
      </p>
      <Diagram subject={null} pieces={null} moves={null} captures={null} />
    </section>
  )
}