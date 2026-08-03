/**
 * Board geometry. Shared because the view and the position data have to agree on
 * what a square is called, and a second copy of these arrays would let them
 * disagree.
 */

/** Files a to m, left to right. */
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']

/** Ranks 13 down to 1, which is the order the board renders them in. */
export const RANKS = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]