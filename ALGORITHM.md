# Turn algorithm

One pass per turn. The board is read many times and copied never. Every step below is
written from White's point of view; Black's turn is the same with the colours swapped.

Every piece is read as enhanced or restricted, decided by its own Marshal. A piece is
enhanced while its Marshal stands on g7, wherever that piece is, and otherwise while the
piece itself stands within Chebyshev distance 4 of that Marshal. It is restricted anywhere
further out, and every piece is restricted once its Marshal is captured. The Pope and the
Emperor are never affected. What each version reaches is the piece's own rule, and those
rules live in the README.

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
Measure the distance from that piece to that square, not from the Pope. Read it as enhanced
or restricted by the black Marshal's command zone, taken at the square it stands on, since
White's Marshal has no bearing on what Black can do.

Four kinds answer differently:

- A dormant Emperor never answers yes.
- A Marshal answers on its own, for check and for pin alike, because the enemy Pope is
  exempt from the support its other captures need.
- A Mage answers at distance 1 in any of the eight directions and never further, because it
  blasts the ring around it rather than capturing.
- An Assassin lands one square past what it takes, so it answers yes only when that landing
  square is empty and not defended by White. On a corner there is nothing behind the target,
  so it takes the corner square itself, and both conditions apply there.

A yes on a line with no shield is a check, and the square the black piece stands on is
recorded. A yes on a line with a shield is a pin, and the shield is recorded with the
direction of that line.

No leap is ever met by walking a line, so the Templar is handled separately: test the sixteen
squares a Templar could leap from onto the Pope. The 3-and-2 shape always counts, the 2-and-1
shape only when that Templar is enhanced by its own Marshal's command zone. Skip the test
when Black has no Templar left. Every Templar the test finds gives check, and the test never
yields a pin, because nothing can stand in the way of a leap.

The step produces:

- the squares the checking pieces stand on, White being in check when that list is not empty
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

Any black piece attacking that square wakes it. Finding them is the same walk step 1 makes,
run from the square the white Emperor stands on instead of the Pope's, and read only for
checks: a piece standing in the way means the one behind it cannot reach the Emperor, so
that line is done. The Templar test runs again from that same square, since no leap is ever
met by walking a line.

While dormant it is frozen where it stands. It has no lines, it attacks nothing, it defends
nothing, and nothing takes it or blasts it off the board. It blocks and nothing else.

The step changes one thing: the white Emperor's awake state.

## 3. Arm the riposte

Independent of steps 1 and 2, and the only step that works outward from the white Marshal.

Read the piece lists first. If the white Marshal is gone, the riposte is off and the step is
over. If Black's previous move killed nothing, it is off as well.

Otherwise take the squares where white pieces died on that move. The capture has to have been
made by a black piece: a white Mage destroying white pieces, or dying on its own square, arms
nothing.

Test each of those squares against the white Marshal's square by arithmetic first, since a
square that shares no file, rank or diagonal with it can be dropped without reading the
board at all. Walk the line only for the squares that survive, and the riposte is on for
this turn as soon as one of them has a clear path.

A black dormant Emperor on one of those lines is not a target even while the riposte is on,
and the white Marshal does not count as attacking it. The riposte lasts White's turn alone,
and Black's waking check runs after it has expired, by which time the white Marshal needs
support like any other turn. Moving the white Marshal along the same line changes nothing.

The step produces one flag, carried into the filtering below.

## 4. Build the move list

Read from what the previous turn's step 7 left behind: White's own piece list, the white
Marshal's square, the castling rights, the en passant right, and the promotion slots that
stand open. Walk that list rather than the board.

Decide first which pieces are asked at all. With more than one checker only the Pope, the
Mage and the Assassin can answer, so only those three are built. Otherwise every white piece
in the list is asked, except two that can produce nothing: a white Emperor still dormant, and
a Templar that is pinned, since no leap ever lands on a pin line.

Ask each piece that survives for the moves its own rules allow, reading it as enhanced or
restricted by the white Marshal's command zone at the square it starts from. A Mage blast
carries a condition of its own: at least one black piece must stand in its ring, and it may
not destroy the white Pope.

Three moves come from the rights rather than from the piece alone.

Castling, while the rights on that wing still stand and every square between the Pope and
its Sentinel is empty.

En passant, while that right is still live.

Promotion, on a file where a slot is open, the Legionary's own or one to either side. One
arriving on rank 13 promotes as part of that same move and cannot decline it. One that
already stands on rank 13 takes the slot without leaving its square, and that spends the
whole turn.

Then drop what step 1 has already answered. A pinned piece is held to its own pin line, in
check or not.

While not in check, that is the only cut. Every other move each piece produced is kept.

While in check, only three kinds of move survive:

- the Pope walks away
- the move removes every checker at once
- the move blocks the line of a lone checker

A lone Templar checker cannot be blocked at all, so only its capture and the Pope's own
moves are worth keeping.

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
- material too thin to mate is a draw (nake placeholder code only, dont give it functional first)
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