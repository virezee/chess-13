import type { Point, Step } from '@/types/game'
import { SIZE } from '@/constants/board'
import { MARKS, ARROW } from '@/constants/style'
import { parseSquare, isLeapOffset } from './coordinate'

const centre = (square: string, isFlipped: boolean): Point => {
  const { file, rank } = parseSquare(square)
  return {
    x: (isFlipped ? SIZE - 1 - file : file) + .5,
    y: (isFlipped ? rank - 1 : SIZE - rank) + .5
  }
}
const unit = (from: Point, to: Point): Point => {
  const length = Math.hypot(to.x - from.x, to.y - from.y)
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length }
}
const across = ({ x, y }: Point): Point => ({ x: -y, y: x })
const offset = (point: Point, direction: Point, span: number): Point => ({
  x: point.x + direction.x * span,
  y: point.y + direction.y * span
})
const outline = (points: Point[]): string =>
  points.map(({ x, y }) => `${Number(x.toFixed(3))} ${Number(y.toFixed(3))}`).join(', ')
export const markColour = (event: {
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}): string =>
  event.ctrlKey
    ? MARKS.yellow
    : event.shiftKey
      ? MARKS.green
      : event.altKey
        ? MARKS.blue
        : MARKS.red

export const mark = (
  marks: Record<string, string>,
  square: string,
  colour: string
): Record<string, string> => {
  const next = { ...marks }
  if (next[square] === colour) delete next[square]
  else next[square] = colour
  return next
}
export const arrowPoints = ({ from, to }: Step, isFlipped: boolean): string => {
  const start = centre(from, isFlipped)
  const end = centre(to, isFlipped)
  const spanX = Math.abs(end.x - start.x)
  const spanY = Math.abs(end.y - start.y)
  const isElbow = isLeapOffset(spanX, spanY)
  const bend = isElbow
    ? spanY > spanX
      ? { x: start.x, y: end.y }
      : { x: end.x, y: start.y }
    : null
  const first = unit(start, bend ?? end)
  const last = bend === null ? first : unit(bend, end)
  const sideFirst = across(first)
  const sideLast = across(last)
  const half = ARROW.width / 2
  const wing = ARROW.headWidth / 2
  const base = offset(start, first, ARROW.start)
  const neck = offset(end, last, -ARROW.headLength)
  const outer = bend === null ? [] : [offset(offset(bend, sideFirst, half), sideLast, half)]
  const inner = bend === null ? [] : [offset(offset(bend, sideFirst, -half), sideLast, -half)]
  return outline([
    offset(base, sideFirst, half),
    ...outer,
    offset(neck, sideLast, half),
    offset(neck, sideLast, wing),
    end,
    offset(neck, sideLast, -wing),
    offset(neck, sideLast, -half),
    ...inner,
    offset(base, sideFirst, -half)
  ])
}