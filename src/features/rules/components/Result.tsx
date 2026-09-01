function Endings() {
  return (
    <ul className='mt-3 space-y-2 text-[15px] leading-relaxed text-ink-dim'>
      <li>
        <span className='font-semibold text-ink'>The Pope is checkmated.</span> The side that is
        mated loses, exactly as in chess.
      </li>
      <li>
        <span className='font-semibold text-ink'>
          A side has no legal move and is not in check.
        </span>{' '}
        That side wins.
      </li>
      <li>
        <span className='font-semibold text-ink'>
          A move repeats the same position a third time.
        </span>{' '}
        Whoever plays that move loses.
      </li>
      <li>
        <span className='font-semibold text-ink'>The no-progress limit runs out.</span> Draw.
      </li>
      <li>
        <span className='font-semibold text-ink'>Neither side has enough material to mate.</span>{' '}
        Draw.
      </li>
    </ul>
  )
}
function Stalemate() {
  return (
    <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
      The second result is the one that catches chess players out. Strip your opponent of every
      legal move without mating them and you are the one who loses. Chess would call that a draw.
      Here you have to keep a move available to them and then finish with mate.
    </p>
  )
}
function Repetition() {
  return (
    <>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        The third is threefold repetition, and here it is not a draw. Whoever plays the move that
        brings a position up for the third time loses the game on that move. The move stays legal,
        it simply loses.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        A position counts as repeated when every piece stands where it stood, the same side is on
        move, and the same castling, en passant and riposte rights are still open.
      </p>
    </>
  )
}
function NoProgress() {
  return (
    <>
      <h3 className='mt-6 font-reading text-[18px] leading-none text-ink'>The no-progress limit</h3>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        The game is drawn once neither side has made progress for long enough. Progress is a
        capture, a blast, a Legionary step or a promotion. Every turn without one adds a point to
        the count, and the next turn with one clears it. A turn is a move from each side, the way
        chess counts its fifty.
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        How many of those turns you are allowed is read off the board:
      </p>
      <p className='mt-2.5 font-mono text-[13px] text-ink'>
        limit = 60 + 2 &times; (52 &minus; pieces on board)
      </p>
      <p className='mt-2.5 text-[15px] leading-relaxed text-ink-dim'>
        Mate takes far longer with two pieces than with twenty, so one fixed number would cut real
        endgames short and let a crowded middlegame sit still for far too long. The line runs
        between two points. At 52 pieces, the opening, it gives 60 turns, the fifty of chess
        stretched for a board 13 files wide instead of 8. At 3 pieces, a bare Pope against a Pope
        and one other, it gives 158, roughly double the longest mate this game is expected to need.
        Everything between sits on the straight line joining them, and that is all the 2 is: each
        piece that leaves the board buys two more turns.
      </p>
    </>
  )
}
export function Result() {
  return (
    <section>
      <h2 className='font-reading text-[22px] leading-none text-ink'>The Result</h2>
      <p className='mt-3 text-[15px] leading-relaxed text-ink-dim'>
        White moves first, and the game is decided on the Pope. There are five results, and two of
        them do not exist in chess.
      </p>
      <Endings />
      <Stalemate />
      <Repetition />
      <NoProgress />
    </section>
  )
}