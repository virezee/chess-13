import type { ArmyState, GameCounters, LoggedTurn, Side } from "./types";

/**
 * Placeholder state so the shell can be judged before the engine exists.
 * Every value here is shaped the way the engine will eventually return it.
 */

export const turnToMove: Side = "white";

export const blackArmy: ArmyState = {
  side: "black",
  player: "Player 2",
  marshalSquare: "g7",
  aura: "command",
  strongCount: 24,
  pieceCount: 24,
  lost: ["L", "G"],
  promotionSlots: [{ piece: "Mage", files: "i-k" }],
  material: 88.5,
};

export const whiteArmy: ArmyState = {
  side: "white",
  player: "Player 1",
  marshalSquare: "h5",
  aura: "active",
  strongCount: 17,
  pieceCount: 23,
  lost: ["L", "L", "T"],
  promotionSlots: [{ piece: "Templar", files: "c-e" }],
  material: 81.0,
};

export const moveLog: LoggedTurn[] = [
  { number: 1, white: "d3-d7", black: "i11-i7" },
  { number: 2, white: "Mh1-h5", black: "Mm13-i9" },
  { number: 3, white: "Sa1-a4", black: "Th13-i11" },
  { number: 4, white: "j3-j7", black: "Gj11xj7" },
  { number: 5, white: "Hc1-f4", black: "Mi9-g7" },
  { number: 6, white: "Ge1-e3", black: "d11-d7" },
  { number: 7, white: "Ta1-c2", black: "Sm13-m9" },
  { number: 8, white: "Ab1-b5", black: "Hk13-h10" },
  { number: 9, white: "Sa4-e4", black: "f11-f7" },
  { number: 10, white: "Ee1-e5", black: "Ac13-c9" },
  { number: 11, white: "Hf4-i7", black: "Sm9-m5" },
  { number: 12, white: "Mh5-h8", black: null },
];

export const counters: GameCounters = {
  repetition: 1,
  repetitionLimit: 3,
  noProgress: 14,
  noProgressLimit: 84,
};

/** The swap rule is offered on black's first turn only. */
export const swapAvailable = false;
