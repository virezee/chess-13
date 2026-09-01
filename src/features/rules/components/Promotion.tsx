export function Promotion() {
  return (
    <section>
      <h2 className='font-reading text-[22px] leading-none text-ink'>Promotion</h2>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        A Legionary that gets to the last rank is traded for one of your own captured pieces.
        Nothing else is on offer, so neither side ever holds more of a type than it began with, and
        the Pope can never be taken.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Where the piece was captured decides who can claim it. A captured piece counts on the file
        it stood on, and a Legionary on the last rank claims it only from that file or the one to
        either side. Say you lose a Sentinel on file c. A Legionary arriving on b13, c13 or d13 can
        take its place, and one arriving on e13 cannot.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A Legionary that arrives while a place is already open trades on the spot, inside the same
        move, with no turn spent on it. If two places are open across its three files, you choose
        which one to take. You cannot arrive and decline, because the move exists only as the trade.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        With no place open it stays on the last rank as a Legionary, and it can wait there for the
        rest of the game. The right never runs out. Once one of your pieces is captured on one of
        its three files it may take that place, and this time the trade is your whole move.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Trading into a Marshal puts the command zone back on the board, and trading into an Emperor
        skips the dormancy.
      </p>
    </section>
  )
}