export const ORTHOGONAL = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
] as const
export const DIAGONAL = []
export const EVERY = [...ORTHOGONAL, ...DIAGONAL] as const