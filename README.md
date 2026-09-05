# Chess 13: Epoch

Chess on a 13 x 13 board with nine piece types and one commander that decides how strong the rest of your army is.

**Play it: https://chess-13-epoch.vercel.app**

**Full rules: https://chess-13-epoch.vercel.app/rules**

Two players, one screen. Free, runs in the browser, no account and no install.

## The idea

Every piece you own exists in two versions, enhanced and restricted. Which one you get depends only on how far that piece stands from your own Marshal.

- Marshal on **g7**, the exact centre of the board: your whole army is enhanced, wherever it stands.
- Marshal anywhere else: every piece within four king steps of it is enhanced, everything further out is restricted.
- Marshal captured: your whole army is restricted for the rest of the game, unless a Legionary promotes into a new one.

A piece is read on the square it starts from, not the one it lands on. The Pope and the Emperor ignore the zone entirely.

So most turns come down to the same question. Use the Marshal as an attacking piece, or leave it where the army needs the zone. It moves like a queen, so you can change your mind quickly.

## The pieces

| Piece     | Chess counterpart | What is different                                                                                                                                   |
| --------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pope      | King              | Unchanged. Castles with a Sentinel and travels three files.                                                                                         |
| Emperor   | Queen             | Starts dormant. Cannot move, cannot be captured, still blocks lines. Wakes when your Marshal dies or when it is attacked at the start of your turn. |
| Marshal   | None              | Moves like a queen, but only captures a piece another of your pieces already attacks. The enemy Pope is exempt. Carries the command zone.           |
| Assassin  | None              | Captures by leaping over the victim and landing on the square beyond, which must be empty and undefended.                                           |
| Sentinel  | Rook              | Captures further than it can move quietly. While enhanced it passes through your own pieces when heading toward your Marshal.                       |
| Mage      | None              | Never captures by moving. It blasts every square around it. Restricted, the blast kills your own pieces too.                                        |
| Herald    | Bishop            | Bishop plus one orthogonal step, so it can change square colour.                                                                                    |
| Templar   | Knight            | Restricted it has only the (3,2) leap. Enhanced it gains the ordinary knight leap as well.                                                          |
| Legionary | Pawn              | Advances any distance up to rank 7, then one square at a time, or two while enhanced.                                                               |

Each side starts with 26 pieces: a full back rank of nine kinds, and thirteen Legionaries in front of it.

## Rules with no equivalent in chess

**Promotion resurrects.** A Legionary reaching the last rank can only become a piece your side has already lost, and only if that piece died on its file or one either side. Neither side ever holds more of a kind than it started with. If no slot is open the Legionary waits, for the rest of the game if it has to.

**Stalemate is a loss for the side that caused it.** Take away every legal move without delivering mate and you lose.

**Threefold repetition is a loss.** Whoever plays the move that brings a position up for the third time loses on that move. The move stays legal.

**The no-progress draw scales with material.** The limit is `60 + 2 x (52 - pieces on board)` turns, so endgames get more room than middlegames.

**The swap rule.** After White's opening move, Black may take over White's side instead of replying. It is a pie rule, so White has to open with something that leaves the two sides level.

## Development

Requires [Bun](https://bun.com).

```bash
bun i
bun dev          # http://localhost:3000
bun run lint
bun run format:check
bun run build    # static export to out/
```

Built with Next.js 16, React 19, Tailwind CSS 4 and TypeScript. The game logic has no runtime dependencies. The site is a static export, so there is no server and no database. Games are saved to localStorage and survive a reload.

The rules page draws its diagrams by calling the real move generator, so the documentation cannot drift from the engine's behaviour.

[`ALGORITHM.md`](./ALGORITHM.md) specifies the turn pipeline in full, from reading check through to persisting the position.

## Status

Playable and complete as a hotseat game. There is no AI opponent and no online play.

Insufficient material is read narrowly for now. A game is drawn on it only when the two Popes are the last pieces on the board.