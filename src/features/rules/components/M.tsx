export function M() {
  return (
    <section>
      <h2 className='font-reading text-[22px] leading-none text-ink'>The Command Zone</h2>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        This is the one rule that has nothing like it in chess, so read it carefully. Every piece
        you own has two versions, enhanced and restricted. Which one you get depends only on how far
        that piece is standing from your own Marshal.
      </p>
      <ul className='mt-3 space-y-2 text-[15px] leading-relaxed text-ink-dim'>
        <li>
          <span className='font-semibold text-ink'>Marshal on g7.</span> Your whole army is
          enhanced, no matter where each piece is standing.
        </li>
        <li>
          <span className='font-semibold text-ink'>Marshal anywhere else.</span> Every piece within
          four squares of it is enhanced. Distance is counted the same way a king moves, so one
          diagonal step counts as one square, and the zone is a 9 by 9 block with the Marshal in the
          middle. That is 81 squares out of 169, or fewer if the Marshal is near an edge of the
          board. Every piece further away is restricted.
        </li>
        <li>
          <span className='font-semibold text-ink'>Marshal captured.</span> Your whole army is
          restricted for the rest of the game, unless a Legionary promotes into a new Marshal and
          the zone comes back.
        </li>
      </ul>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The zone only affects your own pieces. Your opponent&apos;s pieces are enhanced or
        restricted by their own Marshal, not by yours. Two of your pieces ignore the zone
        completely, the Pope and the Emperor. They have one version only, inside the zone or outside
        it.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A piece is read on the square it starts from, not the square it lands on. If it is inside
        the zone at the start of the move, it moves as the enhanced version, even if the move takes
        it outside the zone. It becomes restricted on your next turn.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The zone covers less than half the board, and it moves with the Marshal. If your attack goes
        deep into their half, or out to an edge, those pieces are no longer in the zone and become
        restricted. To keep them enhanced you have to move the Marshal forward too, and if the
        Marshal is captured your whole army stays restricted. So on most turns you have to choose:
        use the Marshal as an attacking piece, or keep it where your army needs the zone. It moves
        like a queen, so you can change your mind quickly.
      </p>
    </section>
  )
}