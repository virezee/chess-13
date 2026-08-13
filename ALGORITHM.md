# Turn algorithm

One pass per turn. The board is read many times and copied never. Every step below is
written from White's point of view; Black's turn is the same with the colours swapped.

## 1. Read the Pope's danger

Read three things from the piece lists step 7 keeps: the white Pope's square, the black
Marshal's square, and whether Black still owns a Templar. Nothing here searches the board
for a piece.

Stand on the Pope's square and walk outward along the eight lines. One walk answers checks
and pins together, because both turn on the same question.

A line runs until it meets a black piece, which ends it. White's own pieces do not end it:
the first is kept as the shield for that line and the walk carries on behind it, and only a
second one closes the line.

Of the black piece that ends a line, ask whether it could capture the square immediately
ahead of it: the Pope's square if the line carried no shield, the shield's square if it did.
Measure the distance from that piece to that square, not from the Pope. Read its strength
from the black Marshal's aura, taken at the square it stands on, since White's Marshal has
no bearing on what Black can do.

A yes on a line with no shield is a check, and the square the black piece stands on is
recorded. A yes on a line with a shield is a pin, and the shield is recorded with the
direction of that line.

Four kinds answer differently:

- A dormant Emperor never answers yes.
- A Marshal answers on its own, for check and for pin alike, because the enemy Pope is
  exempt from the support its other captures need.
- A Mage answers at distance 1 in any of the eight directions and never further, because it
  blasts the ring around it rather than capturing.
- An Assassin lands one square past what it takes, so it answers yes only when that landing
  square is empty and not defended by White. On a corner there is nothing behind the target,
  so it takes the corner square itself, and both conditions apply there.

No leap is ever met by walking a line, so the Templar is probed on its own: test the sixteen
squares a Templar could leap from onto the Pope. The 3-and-2 shape always counts, the 2-and-1
shape only when that Templar stands inside its own Marshal's aura. Skip the probe when Black
has no Templar left. Every Templar the probe finds is a checker, and the probe never yields a
pin, because nothing can stand in the way of a leap.

The step produces:

- the squares the checkers stand on, White being in check when that list is not empty
- the pinned white pieces, each with the direction of its pin

## 2. Wake the Emperor

Independent of step 1 and of the move list.

The white Emperor wakes on either of two counts, read once at the start of White's turn: the
white Marshal has been captured, or a black piece attacks the square the white Emperor
stands on. Once awake it stays awake for the rest of the game, and a white Marshal promoted
later does not put it back to sleep.

Read the piece lists first. If the white Emperor is already awake, or no longer on the
board, the step is over. If the white Marshal is gone, it wakes and the step is over. Only
when none of those hold does anything look at the board.

Any black piece attacking that square wakes it. Finding them is step 1's scan again, run
from the square the white Emperor stands on instead of the Pope's, and read only for checks:
a blocker on a ray means the piece behind it cannot reach the Emperor, so the ray is done.

While dormant it is frozen where it stands. It has no rays, it attacks nothing, it defends
nothing, and nothing takes it or blasts it off the board. It is a blocker and nothing else.

The step changes one thing: the white Emperor's awake state.

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

- **The Pope moves.** Its destination must not be attacked. Castling covers the tiles it
  crosses as well, so f1, e1 and d1 on the left and h1, i1 and j1 on the right, and the Pope
  may not be in check to begin with.
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
- **Moves that leave a black Emperor under attack.** It wakes at the start of Black's turn,
  before Black moves. Read the board once more with it awake. If it reaches the white Pope,
  Black takes the Pope on that turn and White has no reply, so drop the move.

## 6. Read the outcome

If the filtered list is empty:

- in check, White is mated
- not in check, Black has stalemated White, and White wins

If it is not empty, three endings still ride on the move White picks:

- a move that completes a third repetition of the position loses the game for White, and it
  stays legal, so a player left with nothing else has to play it
- material too thin to mate is a draw
- the no-progress counter reaching its limit is a draw, the limit being 60 + 2 × (52 − pieces
  on board), read once when the counter last reset

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
