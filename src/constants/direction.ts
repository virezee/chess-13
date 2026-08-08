export const DIAGONAL = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1]
] as const
export const ORTHOGONAL = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
] as const
export const LEAP_3_2 = [
  [2, 3],
  [3, 2],
  [3, -2],
  [2, -3],
  [-2, -3],
  [-3, -2],
  [-3, 2],
  [-2, 3]
] as const
export const LEAP_2_1 = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2]
] as const
export const EVERY = [...ORTHOGONAL, ...DIAGONAL] as const