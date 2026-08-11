# Turn algorithm

One pass per turn. The board is read many times and copied never. Every step below is
written from White's point of view; Black's turn is the same with the colours swapped.

## 1. Read the Pope's danger

Stand on the white Pope and walk outward along its eight lines. Each line stops at the
first piece it meets, because anything behind that piece is screened and cannot reach the
Pope.

For the first piece on each line, ask one question: from that direction and that distance,
does it capture back to the Pope's square?

- A dormant Emperor guards nothing, so it never answers yes.
- A Marshal checks the Pope on its own. It needs no friendly attacker for that, which is
  the one case where the Marshal counts as an attacker.
- Leapers are never found by walking a line, so the Templar's landing squares are probed
  separately. If the enemy has no Templar left, the probe is skipped.

Carry on past the first friendly piece on a line to answer pins in the same walk: if the
first enemy piece behind it would reach the Pope, that friendly piece is pinned, and the
direction of the line is recorded with it.

What this step produces:

- whether White is in check
- the squares the checkers stand on
- the pinned white pieces, each with the direction of its pin

## 2. Wake the Emperor

Independent of step 1 and of the move list. The white Emperor wakes when its own Marshal
has been captured, or when it is under attack at the start of White's turn.

Attacked here means attacked **legally**. A pinned black piece cannot capture, so it does
not wake the Emperor. This step therefore needs Black's pins, not White's, and cannot be
answered by a plain line scan alone.

The step changes one thing: the Emperor's awake state. Once awake it stays awake.

## 3. Arm the riposte

Independent of steps 1 and 2, and the only step that walks outward from the Marshal rather
than inward to the Pope.

Take the squares where pieces died on Black's previous turn. If any of them lies on one of
the Marshal's lines with a clear path, the riposte is on for this turn.

The step produces one flag, carried into the filtering below.

## 4. Build the move list

Ask every white piece for the moves its own rules allow, then drop what step 1 has already
answered.

While in check, only three kinds of move are worth keeping:

- the Pope walks away
- the move removes every checker at once
- the move blocks the line of a lone checker

Under a double check, or more than two checkers, only three pieces can answer at all, so
only their moves are built:

- the Pope, which walks away
- the Mage, whose blast destroys every checker standing in its ring at once
- the Assassin, which captures one checker and lands behind it, where it may block the
  other line

No other piece can remove or block two checks with one move. A capture takes one checker
and lands on its square, which is never on the other checker's line, and a single piece
cannot stand on two lines at once.

While not in check, a pinned piece is held to its own pin line. A pinned Templar produces
nothing at all, because no leap ever lands on a line, so it can be skipped before its moves
are built.

## 5. Filter to the legal moves

Every test here reads the board as it would be after the move, through a view that marks
which squares are emptied and which piece stands where. Nothing is copied.

- **The Pope moves.** Its destination must not be attacked.
- **Any other piece while in check.** After the move, the Pope must not be attacked.
- **The Assassin captures.** Its landing square must not be attacked by anything that could
  legally capture there. The enemy Marshal and a dormant Emperor are ignored, since neither
  guards the square. A pinned enemy piece counts only when the landing square lies on its
  own pin line, so one pinned defender does not forbid the capture while an unpinned one
  does. On a corner the Assassin takes the square itself, and the same test applies to that
  square.
- **The Marshal captures.** Its victim's square must be covered by White's own army, unless
  the riposte is on or the victim is the enemy Pope. The riposte lifts the requirement
  outright.
- **Moves that empty a square other than the destination.** A Mage blast, an en passant
  capture, and an Assassin's capture all remove a piece that is not standing on the
  destination, so they can open a line to their own Pope even when the moving piece is not
  pinned. The victim may have been screening an enemy slider, and the Assassin's landing
  square lies beyond the victim, which does not always stay on the opened line. These are
  checked against the Pope like a move made while in check.

## 6. Read the outcome

If the filtered list is empty:

- in check, White is mated
- not in check, Black has stalemated White, and White wins

## 7. Play the move

Apply the chosen move to the real board. Castling moves the Sentinel with the Pope.

Then record what the next turn needs:

- the squares where black pieces died, as material for Black's riposte
- each side's remaining pieces, kept as a list by kind and square, so that no later step
  searches the board for the Pope, for the Marshal, or for a kind that is already extinct
- the repetition count and the no-progress count
- the castling rights, which are lost for good once the Pope moves, and per side once that
  side's Sentinel moves or is captured
- the en passant right, created only by a Legionary's full advance onto rank 7 and gone on
  the following reply

## 8. Save and hand over

Persist the state so a reload can continue the game, then repeat from step 1 for Black.
Storing the position together with the rights and counters restores in one read; storing
only the notation restores by replaying the whole game, which costs one full turn
calculation per move played so far.

## Cost

Steps 1 to 3 are one bounded read of the board each. Step 4 is one pass over White's own
pieces. Step 5 is the expensive one, because it reads the board once per move that needs a
test, which is why steps 1 and 4 drop as much as they can before it runs.

The piece lists carried in step 7 are what keep the cost down: nothing searches the board
for a piece, step 1 skips the probes for kinds that are extinct, and step 4 walks one
side's own list rather than every square on the board.
