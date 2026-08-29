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

Read from the piece lists step 7 keeps: the white Pope's square, the black Pope's square, the
black Marshal's square, and the square of each Templar Black still owns. Nothing here searches
the board for a piece.

Stand on the Pope's square and walk outward along the eight lines. One walk answers checks
and pins together, because both ask the same question of the same piece.

A line runs until it meets a black piece, which ends it. White's own pieces do not end it:
the first is kept as the shield for that line and the walk carries on behind it, and a second
one closes the line and produces nothing.

Of the black piece that ends a line, ask one question: could it capture the white Pope's
square, with the shield taken off the board if the line carried one. The distance is measured
from that piece to the Pope's square in both cases. Read the piece as enhanced or restricted
by the black Marshal's command zone, taken at the square it stands on, since White's Marshal
has no bearing on what Black can do.

A yes on a line with no shield is a check, and the square the black piece stands on is
recorded. A yes on a line with a shield is a pin, and the shield is recorded with the
direction of that line.

Four kinds answer that question differently:

- A dormant Emperor never answers yes.
- A Marshal answers on its own, for check and for pin alike, because the enemy Pope is
  exempt from the support its other captures need.
- A Mage answers at distance 1 in any of the eight directions and never further, because it
  blasts the ring around it. An enhanced Mage destroys only what belongs to the other side, a
  restricted one destroys everything standing there, so a restricted Mage answers no with the
  black Pope in that same ring, a blast holding both Popes not being allowed.
- An Assassin lands one square past what it takes, so it answers yes only when the square one
  further along the line, past the Pope, is empty and not defended by White. The white Marshal
  and a white Emperor still dormant are ignored there, since neither guards the square, and the
  Pope is ignored with them, since it is the piece being taken and is gone by the time the
  Assassin stands behind it. Dormant is read as Black's move left it, since the danger asked
  about here is the one that move produced. A pinned white piece defends every square it attacks,
  the pin binding where that piece may move and not where its defence falls, so an Assassin is
  answered on the line it ends and nothing here waits for the rest of the walk.
  A Pope on a corner has no square behind it, so the Assassin stops on the corner itself, and the
  square that must be undefended is the Pope's own, there being none past it to ask about.

A Templar's leap is never met by walking a line, so each Templar Black owns is tested on its
own, from the square the piece list gives it. It answers yes when the offset from that square
to the Pope's is 3 and 2, or 2 and 1 while that Templar is enhanced by its own Marshal's
command zone. Skip the test when Black has no Templar left. Every Templar that answers yes is a
checker, and the test never yields a pin, because nothing can stand in the way of a leap.

The step produces:

- the squares the checkers stand on, White being in check when that list is not empty
- the pinned white pieces, each with the direction of its pin

## 2. Wake the Emperor

Independent of step 1 and of the move list.

While dormant the white Emperor is frozen where it stands. It has no lines, it attacks
nothing, it defends nothing, and nothing takes it off the board. It is a blocker and nothing
else.

It wakes on either of two counts, read once at the start of White's turn: the white Marshal
has been captured, or a black piece attacks the square the white Emperor stands on. Once
awake it stays awake for the rest of the game, and a white Marshal promoted later does not
put it back to sleep.

Read the piece lists first. If the white Emperor is already awake, or no longer on the
board, the step is over. If the white Marshal is gone, it wakes and the step is over. Only
when none of those hold does anything look at the board.

What is left is the second count. Walk the eight lines outward from the square the white
Emperor stands on, as step 1 walks them from the Pope's, except that no piece is a shield
here: the first piece of either colour ends the line, because a piece standing in the way
means the one behind it cannot reach the Emperor. Of the black piece that ends a line, ask
whether it could capture the Emperor's square, measured from the square it stands on and read
as enhanced or restricted by the black Marshal's command zone. The first yes wakes the
Emperor and ends the step.

Two kinds cannot supply that yes, and their reasons are not step 1's:

- A dormant Emperor attacks nothing.
- A Marshal takes the Emperor only with support from another black piece, and that piece
  already attacks the square on its own, so the Marshal is skipped. Its exemption reaches the
  white Pope and nothing else.

A Mage answers at distance 1 like any other piece, and the only question asked of it is whether
it stands in the ring when White's turn opens. Where it came from is never asked, so a Mage that
walked in on Black's move and a Mage that has held that square since the opening position wake
the Emperor alike, and a Mage that walked out before the turn opened wakes nothing. Its blast
can never take a dormant Emperor, so the Emperor sleeps unharmed until the turn that wakes it.

An Assassin answers as it does in step 1, with the square one further along the line, past the
Emperor, empty and not defended by White, and the corner rule unchanged.

Each Templar Black owns is tested from the square the piece list gives it, against the
Emperor's square, by the offsets step 1 uses, since a Templar's leap is never met by walking
a line.

The step changes one thing: the white Emperor's awake state.

## 3. Arm the riposte

Independent of steps 1 and 2, and the cheapest of the three. The flag was worked out and
written down by the step 7 that closed Black's move, so nothing is tested again here. This step
reads it.

A black dormant Emperor on one of the white Marshal's lines is not a target even while the riposte is on,
and the white Marshal does not count as attacking it. The riposte lasts White's turn alone,
and Black's waking check runs after it has expired, by which time the white Marshal needs
support like any other turn. Moving the white Marshal along the same line changes nothing.

The step produces one flag, carried into the filtering below.

## 4. Build the move list

Read from what the previous turn's step 7 left behind: White's own piece list, the white
Marshal's square, the castling rights, the en passant right, the swap right, and the promotion
slots that stand open. Walk that list rather than the board.

Decide first which pieces are asked at all. With more than one checker only the Pope, the
Mage and the Assassin can answer, so only those three are built, unless one of those checkers
is an Assassin, and then every white piece is asked. Otherwise every white piece in the list
is asked, except two that can produce nothing: a white Emperor still dormant, and a Templar
that is pinned, since none of its leaps ever lands on a pin line.

Ask each piece that survives for the moves its own rules allow, reading it as enhanced or
restricted by the white Marshal's command zone at the square it starts from. A pinned piece is
asked along the direction step 1 recorded for it and no other, and a pinned Mage is asked no
further along that direction than the piece pinning it, since an enhanced one leaps and would
otherwise land behind that piece and leave the line open. A Mage blast carries a condition of its own:
at least one black piece the blast can destroy must stand in its ring. A restricted Mage
destroys everything standing there, so two more hold for it, that it may not destroy the white
Pope and that a ring holding both Popes is not allowed. A pinned Mage still blasts, since the
blast leaves it on its square and never opens the pin line.

Three moves come from the rights rather than from the piece alone.

Castling, while White is not in check, the rights on that wing still stand, and every square
between the Pope and its Sentinel is empty.

En passant, while that right is still live.

Promotion, on a file where a slot is open, the Legionary's own or one to either side. One
arriving on rank 13 promotes as part of that same move and cannot decline it. One that
already stands on rank 13 takes the slot without leaving its square, and that spends the
whole turn.

The swap is Black's alone and does not mirror, so it is the one entry here that White never
holds. On Black's first turn, while that right still stands, Black may take over White's side
instead of replying. It is offered beside the moves rather than built as one, since no piece
makes it.

While not in check, every move produced is kept, since the pin was already applied when the
pieces were asked.

While in check, a move survives only when it answers every checker, and the answers need not
be of the same kind:

- the Pope walks away, which answers all of them at once
- the checker is removed
- the checker's line is blocked
- an Assassin checker's landing square is occupied or defended

A lone Templar checker cannot be blocked at all, so only its capture and the Pope's own
moves are worth keeping.

## 5. Filter to the legal moves

Every test here reads the board as it would be after the move, through a view that marks
which squares are emptied and which piece stands where. Nothing is copied.

- **The Pope moves.** Its destination must not be attacked, read as step 1 reads it, so a
  restricted Mage standing with both Popes in its ring does not attack that square. Castling
  covers the tiles it crosses as well, so f1, e1 and d1 on the left and h1, i1 and j1 on the
  right.
- **Any other piece while in check.** After the move, the Pope must not be attacked.
- **The Assassin captures.** Its landing square must not be attacked. The enemy Marshal and a
  dormant Emperor are ignored, since neither guards the square. A pinned enemy piece counts, in
  every direction it attacks, since this asks where Black's defence falls and not which of those
  moves Black would be allowed to play, so a single defender standing on that square forbids the
  capture whether it is pinned or not, and no line is ever walked to tell the two apart. On a
  corner the Assassin takes the square itself, and the same test applies to that square.
- **The Marshal captures.** Its victim's square must be covered by White's own army, unless
  the riposte is on or the victim is the enemy Pope. A pinned white piece still counts, in
  every direction it attacks, since this asks where White's attacks fall and not which of them
  step 4 built. That piece is read as enhanced or restricted with the white Marshal still on
  the square it starts from, which is the reading step 4 already made. The riposte lifts the
  requirement outright.
- **Moves that empty a square other than the destination.** A Mage blast, an en passant
  capture, and an Assassin's capture all remove a piece that is not standing on the
  destination, so they can open a line to their own Pope even when the moving piece is not
  pinned. The victim may have been screening an enemy slider, and the Assassin's landing
  square lies beyond the victim, which does not always stay on the opened line. These are
  checked against the Pope like a move made while in check, and a move that is both takes that
  test once.
- **Moves that wake a black Emperor still dormant**, by attacking it or by capturing the black
  Marshal. It wakes at the start of Black's turn, before Black moves. Read the board once more
  with it awake. If it reaches the white Pope, Black takes the Pope on that turn and White has
  no reply, so drop the move.

## 6. Read the outcome

If the filtered list is empty:

- in check, White is mated
- not in check, Black has stalemated White, and White wins

If it is not empty, three endings still ride on the move White picks. Each takes the counts
step 7 left at the end of Black's move and reads them as the move being judged leaves them:

- the repetition count standing at three loses the game for White, and the move stays legal,
  so a player left with nothing else has to play it. The count is how often the key of the
  position this move leaves stands in the history step 7 keeps, its own occurrence counted in,
  since step 7 pushed that key onto the history before this reading
- material too thin to mate is a draw. This line is a placeholder: the list of what counts as
  too thin does not exist yet, so nothing is read against it either way, whether the code
  carries a test for it or not
- the no-progress count standing at its limit is a draw. It adds 1 for the move just played,
  unless that move was a capture, a Mage blast, a Legionary move or a promotion, which returns
  it to zero instead. Its limit is read at each of those resets, as 60 + 2 × (52 − pieces on
  board) doubled, because the count runs one to a move where the formula counts one to a pair.

One move can bring the first and the last of those at once. The draw is the result.

One ending rides on no move at all. A player may resign while it is that player's turn, and the
other side wins by it. It is read after every ending above, so a game already mated, stalemated or
drawn keeps the result it earned, and the side that resigned is the one step 7 kept.

## 7. Play the move

When Black took the swap, there is no move to apply. The two players trade sides, the one who
took it owning White for the rest of the game, and the reply Black owed falls to the other, so
Black is still the side to move. Nothing below is written again except the swap right, and no
key is pushed, since the board and the side to move are the ones the last key already holds.

Otherwise apply the chosen move to the real board. Castling moves the Sentinel with the Pope.

Then record what the next turn needs:

- each side's remaining pieces, kept as a list by kind and square, so that no later step
  searches the board for the Pope, for the Marshal, or for a kind that is already extinct
- the castling rights, which are lost for good once the Pope moves, and per side once that
  side's Sentinel moves or is captured
- the en passant right, created only by a Legionary's full advance onto rank 7 and gone on
  the following reply
- the riposte flag Black carries into its own turn. Either of two turns it off on its own: the
  black Marshal is gone, or the move just played killed nothing. With neither holding, take
  the squares where black pieces died on this move and test each against the black Marshal's
  square by arithmetic first, since a square that shares no file, rank or diagonal with it can
  be dropped without reading the board at all. Walk the line only for the squares that survive,
  and the flag is on as soon as one of them has a clear path.
- the swap right, which Black holds from the start and loses the moment its first turn is over,
  whether it took the swap or replied with a move, and, once the swap has been taken, which
  player owns White from then on, since nothing on the board says so afterwards
- each Emperor that step 2 has woken, since a woken Emperor stays woken after its attacker
  withdraws and nothing on the board says so afterwards
- the promotion slots each side holds, one for every piece that side has lost, kept by kind and
  by the file it died on, and spent when a Legionary claims one. A Legionary never promotes to a
  Pope or to a Legionary, so neither kind ever opens a slot
- the no-progress count with the limit read at its last reset, and the repetition count, built
  from what stands above, both carried on by the rules step 6 gives them
- the move just applied, written as one ply and appended to the movetext step 8 keeps. This is
  the only step still holding the board the move was made from, so it is the only step that can
  read the piece's letter and the enhanced mark its own Marshal gave it
- the side that resigned, once one has, since a resignation leaves no mark on the board for step 6
  to read it from

The repetition count is how often the board now standing has stood before. Five things make two
boards the same one: where every piece stands, which side is to move, the castling rights, the
en passant right, and the riposte flag. Those five are combined into one key. The key is built
here and pushed onto a history, and step 6 reads the repetition of this move off it, as how often
that same key stands in that history. The
opening position is the first entry of all, since it stands on the board before any move is
made. History behind the last reset of the no-progress count is never read again, since none of
the moves step 6 names as resetting it can be undone.

## 8. Save and hand over

If step 6 ended the game, mated, stalemated, drawn or resigned, delete the saved state and hand
nothing over, since there is no turn left to continue into.

Otherwise persist the state so a reload can continue the game, then repeat from step 1 for
Black.

A reload reads the state back in one read and replays nothing. The movetext is read back with it
and split into rows, since that list is what the player follows the game by, but no move is ever
played again from it.

Written out:

- the board, one entry per square, carrying the kind and the colour of what stands there
- the side to move
- the castling rights, the en passant right, the riposte flag and the swap right, as step 7
  leaves them, and with them which player owns White once the swap has been taken
- for each side, whether its Emperor has been woken
- for each side, the promotion slots still open, by kind and by file
- the no-progress count, together with the limit read at its last reset, since the formula
  reads a piece count the board no longer shows once material has changed since that reset
- the repetition history, as the list of keys step 7 pushes onto it, cut back to the key that
  stood at the last reset of the no-progress count, since step 7 never reads behind that one
- the move just played, kept as the squares it was applied with, so a reload can mark where it
  came from and where it went, and nothing at all before the first move. The movetext cannot
  answer this on its own, since castling writes no square
- the notation of the moves played, kept as a PGN whose movetext is long algebraic: the piece's
  letter, the square it left, `-` for a move or `x` for a capture, and the square it reached,
  `Tg1-h3` and `Tg1xh3`, with the Legionary carrying no letter. Because the square left is
  always written, no move ever needs the disambiguation that shorter chess notation does. Six
  places where chess has no form of its own:
  - a move made by a piece its own Marshal had enhanced ends in `^`, `Tg1-h3^` against
    `Tg1-h3`, so a move written without it was made restricted. A Pope's move, an Emperor's move
    and the Marshal's own move never carry it, since the command zone never reaches the first two
    and the Marshal, standing in its own zone wherever it goes, has no restricted version to tell
    apart from
  - castling writes `O-O-O` to the Emperor's wing and `O-O` to the Marshal's. The count of O's
    marks the wing and nothing else here, the two sides being equal in length
  - a Mage blast writes the Mage's own square on both sides of the `x`, `Gg5xg5`, since a Mage
    never captures by moving and never leaves its square to do it
  - an Assassin's capture writes the square it lands on as the square it reached, `Ac3xe6`, and
    what it took is the square before that one on the line from c3. On a corner it lands on the
    corner itself, which reads as an ordinary capture and is one
  - a promotion taken without leaving the square writes that square on both sides, `d13-d13=Sc`
  - a promotion names the file its slot died on, `d12-d13=Sc`, when two slots of that kind stand
    on different files and the Legionary reaches both

Left out, because a load rebuilds each of them cheaper than a store keeps them true:

- the piece lists, rebuilt by one sweep of the board
- the repetition count, which is how often the last key stands in the history
- each piece's enhanced or restricted reading, which follows from its own Marshal's square