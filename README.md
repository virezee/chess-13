# Chess 13 Concept

## Tech
- Next.js, static export (GitHub Pages / Vercel)
- No online multiplayer
- Hotseat: two players taking turns on one computer
- Save state lives in localStorage. The notation is written after every move so a session survives a reload, and the entry is deleted when the game ends.

## Board
13 x 13. Files a–m, ranks 1–13. Back rank on rank 1 and 13, Legionaries on rank 3 and 11, ranks 2 and 12 empty.

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

13 is odd, so rank 7 is an exact centre rank, which chess does not have. Both sides' opening Legionary advances stop there. Its middle square, g7, is the command square described below.

## Pieces

Back rank layout: `S T H G A E P M A G H T S`

| Letter | Piece | Count per side |
|---|---|---|
| S | Sentinel | 2 |
| T | Templar | 2 |
| H | Herald | 2 |
| G | Mage | 2 |
| A | Assassin | 2 |
| E | Emperor | 1 |
| P | Pope | 1 |
| M | Marshal | 1 |
| L | Legionary | 13 (full rank) |

Letters are initials, except Mage, which takes `G` because `M` belongs to the Marshal — the same idea as Knight taking `N`. Every letter comes from its own piece's name. The pawn is a Legionary, so nothing collides with the Pope's `P`.

## Core mechanic — the Marshal's command aura

Every piece has a strong version and a weak version. Which one it uses depends on where it stands relative to its own Marshal.

| Marshal | Effect |
|---|---|
| On **g7** | The whole army is strong, wherever each piece stands |
| Any other square | Pieces within **Chebyshev distance 4** of the Marshal are strong; everything further out is weak |
| Dead | The whole army is weak |

Chebyshev distance is king-move distance: take the file gap and the rank gap, and use the larger one. Distance 4 means a 9x9 square around the Marshal, 81 of the board's 169 squares when no edge cuts it off.

- The aura only affects your own pieces. The opponent's army runs off their own Marshal.
- Promoting a Legionary into a new Marshal brings the aura back.
- Emperor and Pope are never affected.
- A piece uses the version matching **the square it starts its move from**, not the square it ends on. A Sentinel leaving the aura still moves with strong range on the way out.

g7 is the centre of the board, 6 ranks from either back rank, so both sides reach it on equal terms. It also sits in the middle of the rank 7 contact line, which makes it the most dangerous square on the board for the most valuable piece after the Pope. Castling clears the g file, which is the Marshal's road to it.

| Piece | Strong | Weak |
|---|---|---|
| Legionary | 1 or 2 tiles per move past rank 7 | 1 tile |
| Sentinel | 6 without capturing / unlimited when capturing, and passes through its own pieces when closing on the Marshal | 3 without capturing / 6 when capturing, blocked by anything |
| Templar | 1 or 2 L-jumps plus an optional 1-tile step that cannot capture, **or** stay in place and take one enemy piece standing next to it | 1 L-jump plus an optional 1-tile step that cannot capture |
| Herald | diagonal unlimited, and the 1-tile straight step can capture | diagonal 6, and the 1-tile straight step cannot capture |
| Mage | blast hits its own pieces too, and the Mage survives it | blast spares its own pieces, and the Mage dies with it |
| Assassin | range unlimited | range 6, counting the landing tile |

The weak version is never allowed a free advantage. The owner decides which pieces stand outside the aura, so any upside out there would be taken on purpose rather than suffered. The Mage is the single exception, because its weak blast spares its own pieces — but it pays with its life, and a blast that can be repeated every turn is worth more than a one-shot one. Its friendly fire is avoidable anyway by not standing your own pieces next to it.

## Piece moves

### Legionary (L)
- **Below rank 7:** moves straight forward any distance up to rank 7, and never past it. From its starting rank that is 4 tiles (3 to 7). If the path is blocked it stops short (3 to 5, or 3 to 6) and can still make a long advance later (5 to 7). Standing on rank 6 its only forward move is rank 7.
- The path must be clear; it does not jump. Two pieces never share a tile, so a Legionary stopped in front of an enemy Legionary on rank 7 simply stands on rank 6 facing it.
- **From rank 7 onward:** 1 tile per move up to rank 13, or a free choice of 1 or 2 tiles while it is strong.
- Captures one tile diagonally forward, same as chess.
- **En passant** happens only on a move that lands on rank 7, and only against an enemy Legionary already standing on rank 7. Landing on rank 5 or 6 never triggers it.
  - The geometry matches chess. Black stands on e7, white advances d3 to d7, and black takes by moving diagonally to d6, removing the white Legionary on d7.
  - The right is lost if it is not used on the immediate reply.

### Sentinel (S)
Rook. Straight lines only, and the path must be clear.

| | Moving without capturing | Capturing |
|---|---|---|
| **Strong** | up to 6 tiles, and it passes through its own pieces when closing on the Marshal | unlimited, the whole line |
| **Weak** | up to 3 tiles, blocked by any piece | up to 6 tiles |

The long reach only exists on a move that actually takes something. From rank 1 a non-capturing move stops at rank 7; rank 13 is reachable only if an enemy piece is standing there.

Because its capture reach is the whole line, it defends squares it cannot move to quietly.

These are plain distances and have nothing to do with the centre rank. A Sentinel on rank 5 may move 6 tiles to rank 11. Only the Legionary is stopped by rank 7.

**Passing through its own pieces** only ever applies to a move that does not capture, and only while the Sentinel is closing on its Marshal. A direction counts as closing when it shortens the gap on the axis being travelled. With the Sentinel on e5 and the Marshal on h8, moving up shortens the rank gap and moving right shortens the file gap, so both directions allow it; down and left do not. If the Marshal is on the same file, only vertical moves count. The destination must be strictly closer on that axis than the starting square, so it cannot travel past the Marshal and still claim it. Enemy pieces always block.

### Templar (T)
Knight. The L-shape never changes: 2 and 1, always jumping over whatever is in between.

| | One turn is exactly one of these |
|---|---|
| **Strong** | 1 or 2 L-jumps, plus an optional 1-tile step in any of the 8 directions that cannot capture — **or** stay in place and take one enemy piece standing next to it |
| **Weak** | 1 L-jump, plus an optional 1-tile step in any of the 8 directions that cannot capture |

The optional step may be taken before or after the jumps, and it only moves the Templar. It can never take anything.

A knight's leap cannot reach the square next to it, so taking in place is how a Templar answers a piece pressed against it. Nothing can take back, because the Templar never enters the square it emptied — and the price is the whole turn's movement. Position or a kill, never both.

**A strong Templar standing next to the enemy Pope gives check**, on the same reasoning as the Mage: on its next turn it takes the Pope without moving.

Strong is better on both counts: two jumps instead of one, and the standing kill, which the weak version does not have at all. Taking without moving is the main mechanic of Rifle Chess (1921); here it only reaches one tile, and only inside the aura.

On a double jump:
- The square it passes over is ignored completely. It does not need to be empty, nothing there is taken, and nothing there blocks.
- Only the final square can capture. **Two captures in one turn are never allowed.**
- It cannot finish on the square it started from, which would be a free skipped turn.

### Herald (H)
Bishop, plus one tile straight. That extra step lets it change square colour, so it is not stuck on one colour on an odd board.

| | Diagonal | 1-tile straight step |
|---|---|---|
| **Strong** | unlimited, for moving and capturing alike | can capture |
| **Weak** | up to 6, for moving and capturing alike | cannot capture |

Unlike the Sentinel, its diagonal reach is the same whether or not it captures.

### Mage (G)
Moves like a king: 1 tile, any of the 8 directions.

Its attack is a blast, not a normal capture.
- One turn is either a move or a blast, never both.
- When it blasts, the Mage does not move. Everything on the 8 surrounding tiles is destroyed. From b2 that is a1, a2, a3, b3, c3, c2, c1 and b1.
- **Strong:** the blast takes everything in the ring, including its own pieces, and the Mage survives. It can do this every turn.
- **Weak:** its own pieces are spared, but the Mage dies with the blast.

When a blast is allowed:
- **At least one enemy piece must be in the ring.** An empty ring is not allowed, because that is a skipped turn, and a ring holding only its own pieces is not allowed either, because that is damage for nothing.
- Not allowed if the blast would take your own Pope.
- A Mage standing next to the enemy Pope **already gives check**, because its next turn blasts. If both Popes are in the ring the blast is not allowed, so it is not check — there is no real threat.
- **Blasts do not chain.** A Mage that dies, whether to a blast or to an ordinary capture, does not explode.

### Assassin (A)
Moves along queen lines — unlimited while strong, up to 6 while weak. It cannot be taken back after a capture.

It does not take the victim's square. It slides up to the victim and lands on the tile **directly behind** it. While weak, that landing tile counts inside the range of 6 and can never be beyond it.

A capture is only allowed when the landing tile is:
- **empty** — any piece there blocks it, its own or the enemy's
- **not watched by the enemy** — if the enemy could take it there, the capture is off even though the tile is empty

Both conditions apply to the strong and weak versions alike.

- The path up to the victim must be clear. It slides; it does not jump.
- The landing tile is always exactly one tile past the victim. **One kill per turn** — no chains as in checkers.
- "Watched" means any tile where the enemy could **legally** take it next move, including an enemy Mage's blast ring. A pinned enemy piece cannot legally take, so it does not count as watching, and the capture stands.
- Watching is judged on the board **after** the move, with the Assassin already on the landing tile and the victim already gone. Lines that open because the Assassin left its square, or because the victim disappeared, do count, and they make the capture illegal.
- Check works the same way. An Assassin aiming at the enemy Pope is not giving check if the tile behind the Pope is occupied or watched.

**Board edges.** If the landing tile would be off the board, the capture is simply unavailable and the Assassin has to find another angle. A piece on rank 13 cannot be taken from the front, and a piece on file a cannot be taken along the rank from inside the board.

**Corners are the exception.** Against a piece on a1, m1, a13 or m13, the Assassin takes the corner square itself, the ordinary way, because there is nowhere behind the victim to land. The watching rule still applies: a watched corner square means no capture.

### Emperor (E)
The queen from chess 1.0, unchanged. The aura does not affect it.

### Pope (P)
The king from chess 1.0. This game's central piece, and outside the aura mechanic.

Castling works as in chess. The partner is the **Sentinel**, but the Pope travels **3 files** instead of 2.

| Side | Pope | Sentinel |
|---|---|---|
| Left | g1 to d1 | a1 to e1 |
| Right | g1 to j1 | m1 to i1 |

- Every square the Pope crosses, and the square it lands on, must be unattacked: f1, e1 and d1 on the left; h1, i1 and j1 on the right.
- Every square between Pope and Sentinel must be empty — b to f on the left, h to l on the right — and neither piece may have moved earlier.

### Marshal (M)
Moves like a queen. Its captures are conditional: it may only take a piece that one of its own pieces is already attacking. With no friendly attacker on that target there is no capture. The Marshal finishes what the army already threatens.

- The friendly attacker has to be attacking **legally**. A pinned own piece does not count as support.
- A friendly Mage's blast ring counts as an attack.
- **The Pope is exempt.** A Marshal aiming at the enemy Pope gives check by itself and can mate by itself. Support is only needed against ordinary pieces.
- **Answering a capture in its own lines is exempt.** The trigger is *where* the opponent captured, not which piece died. If the opponent's last move took one of your pieces **on a square lying on one of the Marshal's eight lines, with a clear path from the Marshal to it**, then for that one turn the Marshal may take any enemy piece standing on its lines, with no support needed. If the capture happened off its lines, nothing changes and the support rule applies as usual. The right expires if it is not used on your immediate reply.
  - The square that counts is the one your dead piece was standing on, not the square the capturing piece ended on. Those differ for an Assassin, which lands one tile beyond, for a Mage blast, which never moves, and for en passant, where the capturing Legionary ends up one rank short of its victim.

Worked example. Marshal on d4. The opponent's Herald takes your Legionary on d8 and now stands there; an enemy Sentinel sits on g4 having done nothing.

| Where the opponent captured | On the Marshal's lines from d4? | Marshal may take, no support |
|---|---|---|
| d8 | yes — same file, clear path | the Herald on d8 **or** the Sentinel on g4 |
| m1 | no — 9 files across and 3 ranks up is neither straight nor diagonal | nothing; g4 goes back to needing support |

Two consequences worth knowing. The Marshal wants open lines, because closed ones never trigger it — so this rule pushes it out of hiding. And the enemy Pope may not capture one of your pieces on a square in the Marshal's lines, because the Marshal could answer, which makes it a move into check.

It carries the aura, so its position is a decision every turn. Distance 4 covers 9 of 13 files, enough for one wing and the centre together but never both wings at once. Queen mobility is what makes that workable: the aura can cross the board in a single move.

## Piece values

Estimates built from average mobility on 13 x 13, adjusted by hand for special abilities, with Legionary = 1. The ordering follows chess 1.0's shape: one piece well clear at the top, then a descending ladder that ends in a tie, the way bishop and knight tie in chess.

| Piece | Strong | Weak |
|---|---|---|
| Emperor | 14 | 14 |
| Marshal | 11.5 | — |
| Assassin | 9 | 7 |
| Sentinel | 8.5 | 5 |
| Mage | 8 | 4 |
| Herald | 6.5 | 4.5 |
| Templar | 6.5 | 4.5 |
| Legionary | 1 | 0.9 |

Two warnings about this table. The error on each number is roughly ±1.5, so Marshal above Assassin is an ordering choice supported by a rule difference, not a measured fact. And the aura is positional value, not material — like space or king safety, it is not priced into the Marshal. Taking the Marshal is worth its 11.5 plus whatever the aura was doing at that moment.

## Promotion
Promotion is not a free choice. A Legionary may only become a type that has already been captured, so the board can never hold more of a type than the starting count.

Caps for the whole game:
- Emperor 1 — available only after the Emperor has died
- Marshal 1 — available only after the Marshal has died
- Sentinel, Templar, Herald, Mage, Assassin — 2 each
- Pope is never available. It is the central piece; you cannot promote into a king.

**A slot belongs to the file its piece died on.** A Legionary may only claim a piece that fell on its own file or one file to either side. Arriving on d13 it can take a Sentinel that died on c, d or e, but not an Emperor that died on f — that needs a Legionary arriving on e13, f13 or g13.

So where your pieces die matters as much as which pieces die, and a Legionary has a reason to choose its file early instead of just marching forward.

With no slot available, the Legionary waits on the last rank as long as it takes and stays a Legionary. The chance is never lost: as soon as a slot opens on a file it can reach, it may take that piece. **Promotion costs a full turn**, spent instead of a move.

Because slots depend on **your own** losses, the side that is behind always has more promotion options than the side ahead, which may have nothing to promote into at all. That is the design's counterweight to snowballing.

## Rules
- White moves first
- The Pope is this game's king. Checkmate wins.
- The Emperor is an ordinary piece that can be taken, despite the name. Losing it does not end the game.
- Everything extra here is a rule, not an RPG system. No resources, no cooldowns, no levelling.

### Outcomes

| Situation | Result |
|---|---|
| Pope checkmated | mated side loses |
| No legal move while not in check | **that side wins** |
| A move that repeats a position for the third time | **the player who makes it loses** |
| Insufficient material | draw |
| No-progress limit reached | draw |

**No legal move while not in check is a win for the player who cannot move.** Removing every legal move without delivering mate is the attacker's mistake, not the defender's, so the attacker pays for it. A player who looks completely lost wins on the spot if the opponent shuts them down that thoroughly. Winning therefore takes technique: leave your opponent legal moves, then mate properly.

**Repeating a position for the third time loses the game for whoever does it.** That kills endless checking as an escape: a losing side can no longer check forever, because the move that completes the third repetition loses. The move is legal, it is just fatal, and a player left with nothing but repetitions has to play one.

A position is identified as in chess 1.0: piece placement, side to move, castling rights, en passant rights. The aura needs no separate term, because it follows from where the Marshal stands.

**Only two real draws exist: insufficient material and the no-progress rule.**

### No-progress rule
Progress means any capture, a Mage blast, any Legionary move, or a promotion. Anything else adds 1 to a counter, and progress puts the counter back to zero.

The counter runs in **full turns** — one white move plus one black move counts as 1, the same unit chess uses for its 50-move rule. So a limit of 60 means 120 individual moves.

The limit is not a fixed number. It grows as material disappears:

```
limit = 60 + 2 × (52 − pieces on board)
```

| Pieces on board | Limit |
|---|---|
| 52 (opening) | 60 |
| 40 | 84 |
| 30 | 104 |
| 20 | 124 |
| 10 | 144 |
| 4 | 156 |

The limit is read once when the counter resets and holds for that whole stretch. Piece count only changes through a capture or a blast, and both of those are progress, so they reset the counter anyway.

Both ends of the line come from anchors rather than round numbers. The sparse end is about twice the longest realistic forced mate here: chess technique scaled by 13/8, so K+R's 16 moves becomes about 26 and K+B+N's 33 becomes about 54. The dense end scales the longest stretches seen in real games without a capture or a pawn move, 30 to 40 moves, by the same 1.63. The coefficient of 2 then follows from those two ends: (156 − 60) / (52 − 4).

It has to grow as pieces disappear. A fixed number is too tight for endgames, where real mates run long, and too loose for a crowded middlegame, where 60 moves without a single capture or Legionary advance means nothing is happening.

### Balance for black
Moving first is worth something, and an odd board does not reduce it. Professional records put the first player's edge at about 52% in shogi, 55% in chess and 56% in xiangqi, with no clean relationship to board size.

**The swap rule.** After white's first move, black may take over white's side instead of replying. One button, available only on black's first turn. It is the only method that reaches 50-50 without knowing how large white's edge is: black always takes the better side, so white has to open with a move that leaves the two sides as close to equal as it can manage. Structural advantages are absorbed automatically, including white reaching the rank 7 contact line first.

## Open
- **Which material counts as insufficient.** Chess's list does not carry over: a lone Mage only kills at range 1, a lone Marshal cannot take unsupported pieces, and every piece has a weak version.
- **Checking the no-progress numbers.** Both ends of that formula rest on scaled estimates of how long a forced mate runs here, not on measurement. A retrograde tablebase over Pope plus one piece against Pope is only about 9.5 million states on this board, cheap to compute exactly once the move generator exists. Run it for both versions, since weak pieces mate more slowly. The insufficient-material list comes out of the same run.