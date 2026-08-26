# Chess 13 Concept

## Board

13 × 13. Files a–m, ranks 1–13. The back ranks are rank 1 and rank 13. Legionaries start on rank 3 and rank 11. Ranks 2 and 12 are empty.

```
13  s t h g a e p m a g h t s   <- black back rank
12  . . . . . . . . . . . . .
11  l l l l l l l l l l l l l   <- black Legionaries
10  . . . . . . . . . . . . .
 9  . . . . . . . . . . . . .
 8  . . . . . . . . . . . . .
 7  . . . . . . * . . . . . .   <- g7, the command square
 6  . . . . . . . . . . . . .
 5  . . . . . . . . . . . . .
 4  . . . . . . . . . . . . .
 3  L L L L L L L L L L L L L   <- white Legionaries
 2  . . . . . . . . . . . . .
 1  S T H G A E P M A G H T S   <- white back rank
    a b c d e f g h i j k l m
```

13 is an odd number, so rank 7 is an exact centre rank, which chess does not have. The opening Legionary advance of both sides stops there. The middle square of that rank, g7, is the command square described below.

## Pieces

Back rank layout: `S T H G A E P M A G H T S`

| Letter | Piece     | Count per side   |
| ------ | --------- | ---------------- |
| S      | Sentinel  | 2                |
| T      | Templar   | 2                |
| H      | Herald    | 2                |
| G      | Mage      | 2                |
| A      | Assassin  | 2                |
| E      | Emperor   | 1                |
| P      | Pope      | 1                |
| M      | Marshal   | 1                |
| L      | Legionary | 13 (a full rank) |

Each letter is the initial of its piece, with one exception. The Mage takes `G` because `M` belongs to the Marshal, following the same convention that gives the Knight `N` in chess. Every letter still comes from the name of its own piece. The pawn is called a Legionary, so no letter competes with the Pope's `P`.

## Core mechanic: the Marshal's command zone

Every piece has an enhanced version and a restricted version. Which version applies depends on where the piece stands relative to its own Marshal.

| Marshal          | Effect                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| On **g7**        | The entire army is enhanced, wherever each piece stands.                                                    |
| Any other square | Pieces within **Chebyshev distance 4** of the Marshal are enhanced. Every piece further away is restricted. |
| Captured         | The entire army is restricted.                                                                              |

Chebyshev distance is king-move distance. Take the difference in files and the difference in ranks, then use the larger of the two. Distance 4 describes a 9 × 9 square centred on the Marshal, which covers 81 of the board's 169 squares when no edge cuts it off.

- The command zone affects only your own pieces. The opponent's army responds to their own Marshal.
- Promoting a Legionary into a new Marshal restores the command zone.
- The Emperor and the Pope are never affected.
- A piece uses the version that matches **the square it starts its move from**, not the square it ends on. A Sentinel leaving the command zone still moves at enhanced range on the way out.

g7 is the centre of the board and sits 6 ranks from either back rank, so both sides reach it on equal terms. It also sits at the middle of the rank-7 contact line, which makes it the most dangerous square on the board for the most valuable piece after the Pope. Castling clears the g-file, which is the Marshal's road to it.

| Piece     | Enhanced                                                                                                           | Restricted                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Legionary | 1 or 2 tiles per move past rank 7                                                                                  | 1 tile                                                                  |
| Sentinel  | 6 tiles without capturing, unlimited when capturing, and passes through its own pieces when closing on the Marshal | 3 tiles without capturing, 6 tiles when capturing, blocked by any piece |
| Templar   | Leaps 3 and 2, or 2 and 1                                                                                          | Leaps 3 and 2 only                                                      |
| Herald    | Unlimited diagonal, and the 1-tile straight step can capture                                                       | Diagonal up to 6 tiles, and the 1-tile straight step cannot capture     |
| Mage      | The blast destroys its own pieces as well, and the Mage survives it                                                | The blast spares its own pieces, and the Mage dies with it              |
| Assassin  | Unlimited range                                                                                                    | Range 6, counting the landing tile                                      |

The restricted version never carries an advantage of its own. The owner decides which pieces stand outside the command zone, so any benefit available out there would be claimed deliberately rather than suffered. The Mage is the only exception, because its restricted blast spares its own pieces. It pays for that with its life, and a blast that can be repeated every turn is worth more than a blast that can be used once. Its friendly fire is avoidable in any case, by keeping your own pieces off the surrounding tiles.

## Piece moves

### Legionary (L)

- **Below rank 7.** Moves straight forward any distance up to rank 7, and never past it. From its starting rank that is 4 tiles, rank 3 to rank 7. If the path is blocked, it stops short, for example on rank 5 or rank 6, and it may still make a long advance later, such as rank 5 to rank 7. Standing on rank 6, its only forward move is to rank 7.
- The path must be clear. The Legionary does not jump. Two pieces never share a tile, so a Legionary stopped in front of an enemy Legionary on rank 7 stands on rank 6 facing it.
- **From rank 7 onward.** 1 tile per move up to rank 13. While enhanced, it may choose either 1 or 2 tiles.
- Captures one tile diagonally forward, exactly as in chess.
- **En passant** applies to one move only: the full 4-tile advance from the starting rank onto rank 7. White plays rank 3 to rank 7, black plays rank 11 to rank 7. An enemy Legionary standing beside the arriving piece, on rank 7 and on an adjacent file, may capture it by moving to the square directly behind it on rank 6 and removing it from rank 7.
  - Black stands on d7. White advances from e3 to e7. Black replies by moving to e6 and removes the white Legionary on e7.
  - The geometry is the one chess uses. The capturing piece is level with its victim, and it lands on the square the victim would have stopped on had it advanced one tile short.
  - No other move triggers it. An advance of 3 tiles or fewer does not, a Legionary that reaches rank 7 in stages does not, and the 2-tile advance past rank 7 does not.
  - The right is lost if it is not used on the immediate reply.
  - Only the burst is answerable this way, so the burst can be avoided by advancing in stages, at the cost of the tempo it was worth.

### Sentinel (S)

The rook of this game. Straight lines only, and the path must be clear.

| Version        | Moving without capturing                                                        | Capturing                 |
| -------------- | ------------------------------------------------------------------------------- | ------------------------- |
| **Enhanced**   | Up to 6 tiles, and it passes through its own pieces when closing on the Marshal | Unlimited, the whole line |
| **Restricted** | Up to 3 tiles, blocked by any piece                                             | Up to 6 tiles             |

The long reach exists only on a move that actually captures. From rank 1, a non-capturing move stops at rank 7. Rank 13 is reachable only when an enemy piece is standing there.

Because its capture reach covers the whole line, the Sentinel defends squares that it cannot move to quietly.

These are plain distances and have no connection to the centre rank. A Sentinel on rank 5 may move 6 tiles to rank 11. Only the Legionary is stopped by rank 7.

**Passing through its own pieces** applies only to a move that does not capture. The direction is judged once, from the square the Sentinel starts on: the Marshal must lie ahead on the axis being travelled. With the Sentinel on e5 and the Marshal on h8, moving up and moving right both qualify, because the Marshal stands above and to the right. Moving down or left does not. A Marshal on the Sentinel's own rank disqualifies both vertical directions, and a Marshal on its own file disqualifies both horizontal ones, because there is no gap on the axis being travelled.

Once a direction qualifies it stays qualified for the whole of that direction's range. Any number of its own pieces may be passed, the Marshal included, and the squares beyond the Marshal are still reachable. The landing square must be empty. Enemy pieces always block, and a line that has passed through anything cannot capture for the rest of that direction. A restricted Sentinel never passes through, and neither does any Sentinel whose Marshal has been captured.

### Templar (T)

The leaper of this game. It jumps to a fixed set of squares, and whatever lies in between is irrelevant: nothing on those squares is captured, and nothing on them blocks the jump.

| Version        | Leap                |
| -------------- | ------------------- |
| **Enhanced**   | 3 and 2, or 2 and 1 |
| **Restricted** | 3 and 2 only        |

Capturing works exactly as a knight's does in chess. The Templar lands on the enemy square and takes what stands there, and a square held by one of its own pieces cannot be entered. Moving and capturing use the same landing squares, because a leap has no path that can be closed. One capture per turn, always on the square it lands on.

The restricted Templar is deliberately not a chess knight. A 3-and-2 leap belongs to no orthodox piece, so a Templar outside the command zone has to be read on its own terms. The command zone does not lengthen the leap either. It adds a second shape: inside the command zone the Templar keeps the long leap and gains the short one, taking it from 8 landing squares to 16.

Both leaps change square colour on every jump, so neither confines the Templar to one colour of square. A 3-and-1 leap would, which is why it is not used.

Averaged over the whole board the restricted Templar reaches 5.2 squares and the enhanced one 11.5, against 13.2 and 19.1 for the Herald. A leaper keeps its full count in a crowded position while a slider loses most of its own, so the gap on paper is wider than the gap in play. This is the relationship the knight and the bishop have in chess, where mobility differs by 40 per cent and value by 8.

### Herald (H)

The bishop of this game, plus one straight step of a single tile. That extra step lets it change square colour, so it is not confined to one colour on an odd board.

| Version        | Diagonal                                      | 1-tile straight step |
| -------------- | --------------------------------------------- | -------------------- |
| **Enhanced**   | Unlimited, for moving and capturing alike     | Can capture          |
| **Restricted** | Up to 6 tiles, for moving and capturing alike | Cannot capture       |

Unlike the Sentinel, the Herald's diagonal reach is the same whether or not it captures.

### Mage (G)

Moves like a king: 1 tile in any of the 8 directions.

Its attack is a blast rather than a normal capture.

- A turn is either a move or a blast, never both.
- When it blasts, the Mage does not move. Everything on the 8 surrounding tiles is destroyed. From b2 that covers a1, a2, a3, b3, c3, c2, c1 and b1.
- **Enhanced.** The blast destroys everything in the ring, including its own pieces, and the Mage survives. It may blast every turn.
- **Restricted.** Its own pieces are spared, but the Mage dies with the blast.

Conditions for a legal blast:

- **At least one enemy piece must stand in the ring.** An empty ring is not allowed, because that amounts to a skipped turn. A ring holding only friendly pieces is not allowed either, because that is damage for no gain.
- A blast that would destroy your own Pope is not allowed.
- A Mage standing next to the enemy Pope **already gives check**, because its next turn blasts. If both Popes stand in the ring, the blast is not allowed, so there is no check and no real threat.
- **A dormant Emperor survives the blast**, whether it belongs to the Mage's own side or to the opponent. It stays on its square and the blast passes around it. A sleeping enemy Emperor therefore does not satisfy the condition above, because a ring holding nothing else is a ring the blast cannot touch.
- **Blasts do not chain.** A Mage that dies, whether to another blast or to an ordinary capture, does not explode.

### Assassin (A)

Moves along queen lines, unlimited while enhanced and up to 6 tiles while restricted. It cannot be recaptured after a capture.

The Assassin does not occupy the victim's square. It slides up to the victim and lands on the tile **directly behind** it. While restricted, that landing tile counts inside the range of 6 and can never lie beyond it.

A capture is allowed only when the landing tile is:

- **empty.** Any piece standing there blocks the capture, friendly or enemy.
- **not watched by the enemy.** If the enemy could capture the Assassin on that tile, the capture is unavailable even though the tile is empty.

Both conditions apply to the enhanced and restricted versions alike.

- The path up to the victim must be clear. The Assassin slides and does not jump.
- The landing tile is always exactly one tile past the victim. **One kill per turn.** There are no chains as in checkers.
- "Watched" means any tile where the enemy could **legally** capture the Assassin on the following move, including the blast ring of an enemy Mage. A pinned enemy piece still captures along its own pin line, so it watches the tiles on that line and no others. Anywhere else it does not count as watching, and the capture stands.
- Watching is judged on the board **after** the move, with the Assassin already on the landing tile and the victim already removed. Lines that open because the Assassin left its square, or because the victim disappeared, do count, and they make the capture illegal.
- Check follows the same rule. An Assassin aiming at the enemy Pope does not give check when the tile behind the Pope is occupied or watched.

**Board edges.** If the landing tile would fall off the board, the capture is simply unavailable and the Assassin has to find another angle. A piece on rank 13 cannot be captured from the front, and a piece on file a cannot be captured along the rank from inside the board.

**Corners are the exception.** Against a piece on a1, m1, a13 or m13, the Assassin captures by occupying the corner square itself, in the ordinary way, because there is nowhere behind the victim to land. The watching rule still applies. A watched corner square means no capture.

**The enemy Marshal is the second exception.** Capturing a piece on one of the Marshal's lines arms its riposte, and a riposte lets it capture on those lines without support. The riposte is created by the Assassin's own capture, so it does not guard the landing tile beforehand and never counts as watching. The capture is legal, the Assassin lands, and the Marshal recaptures on the reply. The dormant Emperor behaves the same way, and these are the only two recaptures an Assassin ever faces.

Both squares must lie on the Marshal's lines, and the landing tile is always one tile past the victim, so the pattern is confined to close quarters. With the Marshal on e5, an Assassin arriving along the long diagonal takes f6 and lands on e7, where the Marshal recaptures up the e-file. The same victim taken along the rank, from a6, is safe, because the landing tile g6 stands on none of the Marshal's lines.

### Emperor (E)

The queen of chess 1.0, unchanged. The command zone does not affect it. What is not unchanged is when it may be used at all.

**The Emperor starts dormant and stays dormant while its own Marshal is alive.** A dormant Emperor cannot move, cannot capture, does not guard any square, and cannot be captured. Nothing removes it while it sleeps, a Mage's blast included, and that holds for its own side's Mage as much as the opponent's. It still occupies its square, so it blocks lines like any other piece.

It wakes in either of two ways, and once awake it stays awake for the rest of the game. A promoted Marshal does not put it back to sleep.

- Its own Marshal is captured.
- It is under attack at the start of its owner's turn.

**The waking check is made once, at the start of its owner's turn.** That timing matters. An Emperor that comes under attack during the opponent's turn is still dormant for the rest of that turn, so it cannot be captured on the spot. The opponent always gets the chance to withdraw the attacker first, and if the attacker is withdrawn the Emperor never wakes.

Example. White has a dormant Emperor on e1 and a Herald on e4. Black has a Sentinel on e7. Both Popes and both Marshals stand far away on the other side of the board. The e-file is otherwise empty. White is to move.

1. White plays He4–b7 and opens the e-file itself. The black Sentinel on e7 now attacks e1, six tiles away, which even a restricted Sentinel captures over.
2. Black plays Se7–a7 and pulls the attacker off the file.
3. White's turn begins. e1 is not attacked, so the Emperor stays asleep.

Black owned the turn that followed the opening of the line, which is what let the attacker leave in time.

**Waking an enemy Emperor onto your own Pope is not allowed.** The Emperor wakes at the start of its owner's turn, before that side moves. A move that leaves an enemy Emperor under attack therefore has to be read on the board with that Emperor already awake. If it attacks your Pope there, the opponent takes the Pope on that same turn and you never reply, so the move is unavailable.

Example. Black has a Pope on a1 and a Herald on g1. White has a dormant Emperor on c3 and a Herald on e5, its own Pope and Marshal far away on the other side of the board. The a1–e5 diagonal is otherwise empty. Black is to move and is not in check, because the sleeping Emperor blocks the Herald on e5.

1. Black plays Hg1–d4, over the empty f2 and e3, and attacks c3. Nothing pins that Herald, so the attack is legal.
2. White's turn begins, and the waking check finds c3 attacked, so the Emperor wakes.
3. White plays Ec3xa1, over the empty b2, and takes the Pope.

Black gets no turn between step 1 and step 3, so Hg1–d4 is illegal.

Three consequences are worth stating outright.

A dormant Emperor is an unremovable shield. It can stand in front of the Pope and no capture will ever clear it. Hiding behind it is not free, though: attacking that line wakes the piece being hidden behind.

An Assassin may land on a square next to a dormant Emperor, including directly beside it, because a dormant Emperor guards nothing. If the Assassin's arrival attacks the Emperor, the Emperor wakes on its owner's turn and may take it. This is one of the two ways an Assassin can be recaptured. The other is the Marshal's riposte, described under the Assassin.

Waking your own Emperor early is possible and costs a tempo. Move a piece of your own out of the way, let an enemy line fall on the Emperor, and it wakes at the start of your next turn. The opponent's only answer is to withdraw the attacker, which costs a tempo of their own. So the Marshal's death is the default road to an active Emperor, not the only one.

### Pope (P)

The king of chess 1.0. It is the central piece of this game and stands outside the command zone mechanic.

Castling works as in chess. The partner is the **Sentinel**, and the Pope travels **3 files** instead of 2.

| Side  | Pope     | Sentinel |
| ----- | -------- | -------- |
| Left  | g1 to d1 | a1 to e1 |
| Right | g1 to j1 | m1 to i1 |

- Every square the Pope crosses, and the square it lands on, must be unattacked. On the left that is f1, e1 and d1. On the right that is h1, i1 and j1.
- Every square between the Pope and the Sentinel must be empty, which means b–f on the left and h–l on the right. Neither piece may have moved earlier in the game.

### Marshal (M)

Moves like a queen. Its captures are conditional. It may capture only a piece that one of its own pieces is already attacking. Without a friendly attacker on the target, there is no capture. The Marshal finishes what the army already threatens.

- The friendly attacker only has to be attacking the target square. A pinned friendly piece counts in full, in every direction it attacks, because support asks where the army's attacks fall and not which of them could be played. The pin still binds the pinned piece itself, which may not leave its own line.
- The blast ring of a friendly Mage counts as an attack.
- **The Pope is exempt.** A Marshal aiming at the enemy Pope gives check on its own and can deliver mate on its own. Support is required only against ordinary pieces.
- **The riposte.** Answering a capture in its own lines is exempt. The trigger is _where_ the opponent captured, not which piece died. If the opponent's last move captured one of your pieces **on a square that lies on one of the Marshal's eight lines, with a clear path from the Marshal to that square**, then for that one turn the Marshal may capture any enemy piece standing on its lines, with no support required. If the capture happened off its lines, nothing changes and the support rule applies as usual. The right expires if it is not used on your immediate reply.
  - The square that counts is the one your captured piece was standing on, not the square the capturing piece ended on. The two differ for an Assassin, which lands one tile beyond, for a Mage blast, where the Mage never moves, and for en passant, where the capturing Legionary ends up one rank short of its victim.
  - The line is judged at the moment your piece died, on the board the opponent's move produced. Whether the opponent closes it again afterwards does not matter, because the reply comes immediately.
  - **The killer has to be an enemy piece.** Your own enhanced Mage destroying your own pieces, and your own restricted Mage dying on its own square, do not arm the riposte. Without that condition a Legionary fed to your own blast would buy a free capture.
  - One enemy move arms one riposte, including a blast that kills several of your pieces at once, because the Marshal moves only once.

Worked example. The Marshal stands on d4. The opponent's Herald captures your Legionary on d8 and now occupies that square. An enemy Sentinel sits on g4 and has done nothing.

| Where the opponent captured | On the Marshal's lines from d4?                                            | What the Marshal may capture without support           |
| --------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| d8                          | Yes. Same file, clear path.                                                | The Herald on d8, or the Sentinel on g4.               |
| m1                          | No. Nine files across and three ranks up is neither straight nor diagonal. | Nothing. The Sentinel on g4 requires support as usual. |

Two consequences are worth noting. The Marshal wants open lines, because closed lines never trigger the exemption, so this rule pushes it out of hiding. In addition, the enemy Pope may not capture one of your pieces on a square in the Marshal's lines, because the Marshal could answer, which makes such a capture a move into check.

The Marshal carries the command zone, so its position is a decision every turn. Distance 4 covers 9 of the 13 files, which is enough for one wing and the centre together but never both wings at once. Queen mobility is what makes that workable, because the command zone can cross the board in a single move.

## Piece values

Every number below is worked out rather than assigned. The method is the one chess uses: count how many squares a piece attacks on an empty board, average that over every square it could stand on, and convert the average into points with a rate read off chess itself. Each step is written out at full precision and rounded only at the end.

### The rate, read off chess

Chess sets its own values against its own mobility on 8 × 8. Every mobility
figure below is counted on an empty board, using three rules that hold for any
n × n board:

- **Straight lines:** `2n²(n − 1)`. Each of the n² squares sees n − 1 squares
  each way along its rank, and the same along its file.
- **Diagonals:** `2n(n − 1)(2n − 1) / 3`. A diagonal of length L carries
  L(L − 1) ordered pairs of squares. Summing that over the diagonal lengths
  1, 2, … n − 1, n, n − 1, … 1 and doubling for the second direction gives the
  closed form.
- **Leap (a, b):** `8(n − a)(n − b)`. A leaper has 8 fixed vectors, and the
  vector (a, b) fits on the (n − a)(n − b) squares that leave room for it.

| Piece  | Value | Attacks, all squares     | Average           | Value ÷ average |
| ------ | ----- | ------------------------ | ----------------- | --------------- |
| Pawn   | 1     | 84 = 6 × 14              | 1.75 = 84 / 48    | 0.5714          |
| Knight | 3     | 336 = 8 × 6 × 7          | 5.25 = 336 / 64   | 0.5714          |
| Bishop | 3     | 560 = 2 × 8 × 7 × 15 / 3 | 8.75 = 560 / 64   | 0.3429          |
| Rook   | 5     | 896 = 2 × 64 × 7         | 14 = 896 / 64     | 0.3571          |
| Queen  | 9     | 1456 = 896 + 560         | 22.75 = 1456 / 64 | 0.3956          |

The Value column is the only thing here that is not counted. It is the
conventional chess scale, taken as given, and the rate is calibrated against
it. That scale is a convention rather than a measurement. Different sources set
it differently, some rating the bishop above the knight and the statistical
studies putting both minor pieces above 3, so the rate carries whatever
uncertainty the convention it is read from carries.

The three sliders come out at 0.3429, 0.3571 and 0.3956, which average to
0.3652: the **rate 0.365 points per square**. They do not land on one figure.
Bishop and rook sit close together and the queen sits 0.05 above them, so the
rate is the midpoint of a spread rather than a value all three share.

The knight sits far outside that spread, at 0.5714, and the ratio
0.5714 / 0.3652 = 1.5647 is the **leaper premium 1.565**. It is not an error in
the rate. A leaper keeps its whole count in a crowded position while a slider
loses most of its own, so the same paper mobility is worth half as much again on
a knight.

The pawn is the third calibration. It attacks 1.75 squares on average, worth
1.75 × 0.365 = 0.6391, yet it is valued at 1. The missing **0.361 is the price
of promotion**. Its ratio reads 0.5714 as well, matching the knight exactly,
because the conventional values put both its mobility and its value at a third
of the knight's. The two premiums have nothing to do with each other and the
match is arithmetic.

### Mobility on this board

169 squares, empty board, counting attacked squares rather than quiet steps,
because value follows what a piece threatens. The three rules above carry over
with n = 13. Two shapes appear here that chess has no piece for, and they need
rules of their own:

- **A range cap of r** replaces the full line with min(r, distance to the edge)
  in each direction. A line of 13 squares sums to 57 looking one way and 114
  looking both, and the board holds 26 such lines, 13 ranks and 13 files.
  Diagonals have no single length, so the same cap is summed over the diagonal
  lengths 1, 2, … 13, … 2, 1, which comes to 1118 per direction.
- **A step of 1** is `4n(n − 1)` straight and `4(n − 1)²` diagonal, 624 and 576
  here. The ring of 8 is the two together.

Ordered from the least mobile pattern to the most:

| Pattern                  | Attacks, all squares | Average              |
| ------------------------ | -------------------- | -------------------- |
| Diagonal forward capture | 240 = 10 × 24        | 1.8462 = 240 / 130   |
| Straight step of 1       | 624 = 4 × 13 × 12    | 3.6923 = 624 / 169   |
| Leap 3-2 only            | 880 = 8 × 10 × 11    | 5.2071 = 880 / 169   |
| Ring of 8                | 1200 = 624 + 576     | 7.1006 = 1200 / 169  |
| Leap 3-2 and 2-1         | 1936 = 880 + 1056    | 11.4556 = 1936 / 169 |
| Diagonal, up to 6        | 2236 = 2 × 1118      | 13.2308 = 2236 / 169 |
| Diagonal, unlimited      | 2600 = 2 × 1300      | 15.3846 = 2600 / 169 |
| Straight, up to 6        | 2964 = 26 × 114      | 17.5385 = 2964 / 169 |
| Straight, unlimited      | 4056 = 26 × 156      | 24 = 4056 / 169      |
| Queen lines, up to 6     | 5200 = 2964 + 2236   | 30.7692 = 5200 / 169 |
| Queen lines, unlimited   | 6656 = 4056 + 2600   | 39.3846 = 6656 / 169 |

The diagonal forward capture follows the pawn's count on the chess board. Each
rank carries 24 attacks, 1 from each edge file and 2 from the 11 files between
them, and the Legionary stands on 10 of the 13 ranks, so the average is taken
over 130 squares rather than 169.

The Herald's enhanced count is 15.3846 + 3.6923 = 19.0769, its straight step being able to capture. Its restricted count is the diagonal alone, 13.2308, because that step cannot capture there. The Sentinel is read on its capture range, not its quiet range, which is why the enhanced one counts the whole line.

### Rate applied

The rate is 0.3652, the figure read off chess above: the average of the bishop's
0.3429, the rook's 0.3571 and the queen's 0.3956.

| Piece     | Pattern, enhanced | Average | × 0.3652 | Pattern, restricted | Average | × 0.3652 |
| --------- | ----------------- | ------- | -------- | ------------------- | ------- | -------- |
| Legionary | Diagonal capture  | 1.8462  | 0.6742   | same                | 1.8462  | 0.6742   |
| Mage      | Ring of 8         | 7.1006  | 2.5931   | same                | 7.1006  | 2.5931   |
| Templar   | Both leaps        | 11.4556 | 6.5461   | Leap 3-2            | 5.2071  | 2.9755   |
| Herald    | Diagonal + step   | 19.0769 | 6.9669   | Diagonal to 6       | 13.2308 | 4.8319   |
| Sentinel  | Straight unlim.   | 24.0000 | 8.7648   | Straight up to 6    | 17.5385 | 6.4051   |
| Assassin  | Queen unlimited   | 39.3846 | 14.3833  | Queen up to 6       | 30.7692 | 11.2370  |
| Marshal   | Queen unlimited   | 39.3846 | 14.3833  | N/A                 | N/A     | N/A      |
| Emperor   | Queen unlimited   | 39.3846 | 14.3833  | same                | 39.3846 | 14.3833  |

The Templar's two figures carry the leaper premium: 11.4556 × 0.3652 × 1.5647 = 6.5461 and 5.2071 × 0.3652 × 1.5647 = 2.9755.

### Four adjustments, each for a rule

Mobility cannot see a condition attached to a capture, and it cannot see a capture that takes more than one piece. Four pieces need a factor, and the factor is stated rather than hidden:

| Piece            | Factor | Why                                                                                                                                                       |
| ---------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marshal          | × 0.78 | It holds every queen line for moving but may only capture what its own army already attacks, so a large part of what it reaches it cannot take.           |
| Assassin         | × 0.61 | The landing tile must be empty and unwatched, which strikes out most of what it attacks. What holds it as high as it is, is that it cannot be recaptured. |
| Mage, enhanced   | × 3.00 | Its ring is only 7.1006 squares, but a blast destroys everything standing in it at once. Mobility prices one capture per turn, and this is up to eight.   |
| Mage, restricted | × 1.50 | The same blast used once. The Mage dies with it, so the ring is worth half again rather than three times.                                                 |
| Legionary        | + 0.34 | Promotion, the same premium chess pays its pawn, added rather than multiplied because it does not scale with what the piece attacks.                      |

Working them through: 14.7692 × 0.78 = 11.5200. 14.7692 × 0.61 = 9.0092 and 11.5385 × 0.61 = 7.0385. 2.6627 × 3.00 = 7.9880 and 2.6627 × 1.50 = 3.9940. 0.6923 + 0.3437 = 1.0360. The restricted Legionary attacks exactly what the enhanced one attacks and differs only in how fast it walks, so it takes a notch of its own to 0.9.

### The table

Rounded to whole points, half up, the way chess carries its 1, 3, 5 and 9:

<table>
  <thead>
    <tr><th>Piece</th><th>Enhanced</th><th>Restricted</th></tr>
  </thead>
  <tbody>
    <tr><td>Pope</td><td colspan="2" align="center">∞</td></tr>
    <tr><td>Emperor</td><td colspan="2" align="center">14.7692 → 15</td></tr>
    <tr><td>Marshal</td><td colspan="2" align="center">11.5200 → 12</td></tr>
    <tr><td>Assassin</td><td>9.0092 → 9</td><td>7.0385 → 7</td></tr>
    <tr><td>Sentinel</td><td>9.0000 → 9</td><td>6.5769 → 7</td></tr>
    <tr><td>Mage</td><td>7.9880 → 8</td><td>3.9940 → 4</td></tr>
    <tr><td>Herald</td><td>7.1538 → 7</td><td>4.9615 → 5</td></tr>
    <tr><td>Templar</td><td>6.5297 → 7</td><td>2.9681 → 3</td></tr>
    <tr><td>Legionary</td><td>1.0360 → 1</td><td>0.9000 → 1</td></tr>
  </tbody>
</table>

The Pope carries no number at all. Losing it ends the game, so it is never traded and there is nothing to price it against, which is the reading chess gives its own king. It also stands outside the command zone, so both columns hold the same mark.

One piece stands well clear at the top of the rest. Below it the ladder ties twice, at 9 between the Assassin and the Sentinel and at 7 between the Herald and the Templar, in the way the bishop and the knight tie in chess. The two Legionaries land on the same point as well: the restricted one walks slower but attacks exactly what the enhanced one attacks, and that difference sits below the resolution of whole points.

Three numbers turn on the rounding rather than on the count. The restricted Sentinel at 6.5769 and the Templar at 6.5297 both cross to 7 from just above the halfway mark, and the Marshal reaches 12 by two hundredths.

Two warnings apply. The rate is read off chess and the adjustments are judgments, so the error on each number is roughly ±1.5, wider than any tie in the table, which makes those ties an accident of arithmetic rather than a measured equality. In addition, the command zone is positional value rather than material. Like space or king safety, it is not priced into the Marshal. Capturing the Marshal is worth its 12 plus whatever the command zone was contributing at that moment.

## Promotion

Promotion is not a free choice. A Legionary may only become a type that has already been captured, so the board can never hold more of a type than the starting count.

Caps for the whole game:

- Emperor: 1, available only after the Emperor has died.
- Marshal: 1, available only after the Marshal has died.
- Sentinel, Templar, Herald, Mage and Assassin: 2 each.
- Pope: never available. It is the central piece, and you cannot promote into a king.

**A slot belongs to the file its piece died on.** A Legionary may only claim a piece that fell on its own file or on one file to either side. Arriving on d13, it can take a Sentinel that died on file c, d or e, but not an Emperor that died on file f. That Emperor requires a Legionary arriving on e13, f13 or g13.

Where your pieces die therefore matters as much as which pieces die, and a Legionary has a reason to choose its file early instead of marching straight forward.

**Arriving on an open slot promotes at once.** A Legionary that reaches the last rank on a file where a slot is already open changes type as part of that same move, at no extra cost. Where more than one slot is within reach it chooses between them, but it cannot decline: the move exists only as a promotion.

With no slot available the Legionary waits on the last rank for as long as it takes and remains a Legionary. The chance is never lost. As soon as a slot opens on a file it can reach it may take that piece, and claiming it from a standstill **costs a full turn**, spent instead of a move.

Because slots depend on **your own** losses, the side that is behind always has more promotion options than the side ahead, which may have nothing to promote into at all. This is the design's counterweight to snowballing.

## Rules

- White moves first.
- The Pope is the king of this game. Checkmate wins.
- The Emperor is an ordinary piece and can be captured, despite the name. Losing it does not end the game.
- Everything additional here is a rule, not an RPG system. There are no resources, no cooldowns and no levelling.

### Outcomes

| Situation                                         | Result                             |
| ------------------------------------------------- | ---------------------------------- |
| Pope checkmated                                   | The mated side loses.              |
| No legal move while not in check                  | **That side wins.**                |
| A move that repeats a position for the third time | **The player who makes it loses.** |
| No-progress limit reached                         | Draw.                              |
| Insufficient material                             | Draw.                              |

**No legal move while not in check is a win for the player who cannot move.** Removing every legal move without delivering mate is the attacker's mistake rather than the defender's, so the attacker pays for it. A player who appears completely lost wins on the spot if the opponent shuts them down that thoroughly. Winning therefore requires technique: leave your opponent legal moves, then deliver mate properly.

**Repeating a position for the third time loses the game for whoever does it.** This removes endless checking as an escape. A losing side can no longer check forever, because the move that completes the third repetition loses. The move remains legal, it is simply fatal, and a player left with nothing but repetitions has to play one.

A position is identified as in chess 1.0: piece placement, side to move, castling rights and en passant rights, plus the Marshal's riposte right, which is a one-reply right of the same kind. The command zone needs no separate term, because it follows from where the Marshal stands.

**Only two genuine draws exist: insufficient material and the no-progress rule.**

### No-progress rule

Progress means any capture, a Mage blast, any Legionary move, or a promotion. Anything else adds 1 to a counter, and progress returns the counter to zero.

The counter runs in **full turns**. One white move plus one black move counts as 1, which is the unit chess uses for its 50-move rule. A limit of 60 therefore means 120 individual moves.

The limit is not a fixed number. It grows as material disappears:

```
limit = 60 + 2 × (52 − pieces on board)
```

| Pieces on board | Limit |
| --------------- | ----- |
| 52 (opening)    | 60    |
| 40              | 84    |
| 30              | 104   |
| 20              | 124   |
| 10              | 144   |
| 4               | 156   |

The limit is read once when the counter resets and holds for that entire stretch. The piece count changes only through a capture or a blast, and both of those count as progress, so they reset the counter in any case.

The formula is a straight line drawn through two points, and nothing more. At 52 pieces the limit is 60, at 4 pieces it is 156. The coefficient is the slope between them, (156 − 60) ÷ (52 − 4) = 2, and 60 is the value the line takes at the dense end. That is where the multiplication comes from: every piece that leaves the board is one step along the run, and each step is worth 2 moves of rise. The division appears once, in working that slope out, and never again.

Each number in it:

- **52** is the opening piece count, 26 a side: a back rank of 13 and a rank of 13 Legionaries.
- **4** is the sparse end of the table, a Pope and one other piece on each side, which is the thinnest material this game can still force mate with.
- **13/8 = 1.625** is the scale between this board and the chess board. It is taken on the edge rather than the area, because forcing mate is a matter of driving the enemy king to an edge, so the work grows with the length of a side and not with the number of squares.
- **60**, the dense end, is a chess figure carried over by that scale. Stretches of 30 to 40 moves without a capture or a pawn move are ordinary in locked positions; 30–40 scaled is 49–65, and 60 is the round number taken from inside that band. The band is an estimate rather than a measurement, and it cannot be measured upward: the fifty-move rule ends the game at 50, so no longer stretch is ever recorded. The known game that reached that ceiling is Filipowicz–Smederevac, Polanica-Zdrój 1966, drawn on move 70 with the last pawn move on Black's 20th and all 32 pieces still standing.
- **156**, the sparse end, is set at about twice the longest forced mate this game is expected to hold. The two chess anchors under it are exact, both settled by tablebase: king and rook mate a lone king in at most 16 moves, king, bishop and knight in at most 33. Scaled by 1.63 those become roughly 26 and 54, and twice 54 is 108. The rest of the way to 156 is headroom for the restricted versions, which mate more slowly than anything chess has, and that headroom is the one figure here with no anchor at all.

So two of the numbers are exact, 52 and 4 by counting and 16 and 33 by tablebase; one is a scale chosen on the board's edge, 1.63; and two rest on estimates, the 30–40 band under 60 and the headroom above 108 that produces 156. The coefficient 2 is not an estimate of its own, it only reports the slope between whatever those two ends are set to.

The limit has to grow as pieces disappear. A fixed number is too tight for endgames, where real mates run long, and too loose for a crowded middlegame, where 60 moves without a single capture or Legionary advance means nothing is happening.

### Balance for black

Moving first is worth something, and an odd board does not reduce it. Professional records put the first player's edge at about 52% in shogi, 55% in chess and 56% in xiangqi, with no clean relationship to board size.

**The swap rule.** After white's first move, black may take over white's side instead of replying. It is a single button, available only on black's first turn. It is the only method that reaches 50-50 without knowing how large white's edge is. Black always takes the better side, so white has to open with a move that leaves the two sides as close to equal as possible. Structural advantages are absorbed automatically, including the fact that white reaches the rank-7 contact line first.

## Open

- **Which material counts as insufficient.** The chess list does not carry over. A lone Mage only kills at range 1, a lone Marshal cannot capture unsupported pieces, and every piece has a restricted version.
- **Verifying the no-progress numbers.** Both ends of that formula rest on scaled estimates of how long a forced mate runs in this game, not on measurement. A retrograde tablebase covering the Pope plus one piece against the Pope comes to only about 9.5 million states on this board, which is cheap to compute exactly once the move generator exists. Run it for both the enhanced and the restricted version, since restricted pieces mate more slowly. The insufficient-material list comes out of the same run.