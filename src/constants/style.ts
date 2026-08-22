export const COORDS = 'var(--coords-width)'
export const SQUARE = 'var(--square-size)'
export const BOARD = 'var(--board-size)'
export const PATTERN = 'var(--board-pattern)'
export const FONT_SIZE = 80
export const BASELINE = 50 + (FONT_SIZE * .7) / 2
export const BUFF = { white: 'var(--zone-white)', black: 'var(--zone-black)' } as const
export const SELECTED = 'var(--square-selected)'
export const DEST = 'var(--move-dest)'
export const DEST_CAPTURE = 'var(--move-dest-capture)'
export const LAST = 'var(--square-last)'
export const CHECK = 'var(--square-check)'
export const MARKS = {
  red: 'var(--mark-red)',
  yellow: 'var(--mark-yellow)',
  green: 'var(--mark-green)',
  blue: 'var(--mark-blue)'
} as const