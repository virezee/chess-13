import type { MouseEvent, CSSProperties } from 'react'
import type { SquareOccupant } from '@/types/material'
import type { Point, Step, Move } from '@/types/game'
import { SIZE } from '@/constants/board'
import { LEAP } from '@/constants/piece'
import { SQUARE, MARKS, ARROW } from '@/constants/style'
import { parseSquare, makeSquare } from './coordinate'

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
export const squareFromEvent = (event: MouseEvent<HTMLDivElement>, isFlipped: boolean): string => {
  const box = event.currentTarget.getBoundingClientRect()
  const column = Math.min(SIZE - 1, Math.floor(((event.clientX - box.left) / box.width) * SIZE))
  const row = Math.min(SIZE - 1, Math.floor(((event.clientY - box.top) / box.height) * SIZE))
  return makeSquare({
    file: isFlipped ? SIZE - 1 - column : column,
    rank: isFlipped ? row + 1 : SIZE - row
  })
}
export const remapIds = (
  ids: Map<string, number>,
  occupancy: SquareOccupant,
  move: Move | null,
  lastId: number
): { ids: Map<string, number>; lastId: number } => {
  const next = new Map(ids)
  let id = lastId
  if (move !== null) {
    move.captures?.forEach(square => next.delete(square))
    if (move.sentinel !== undefined) {
      const sentinelId = next.get(move.sentinel.from)
      next.delete(move.sentinel.from)
      if (sentinelId !== undefined) next.set(move.sentinel.to, sentinelId)
    }
    const moverId = next.get(move.from)
    next.delete(move.from)
    if (moverId !== undefined && !move.captures?.includes(move.from)) next.set(move.to, moverId)
  }
  for (const square of Object.keys(occupancy))
    if (!next.has(square)) {
      id += 1
      next.set(square, id)
    }
  for (const square of next.keys()) if (occupancy[square] === undefined) next.delete(square)
  return { ids: next, lastId: id }
}
export const origin = (move: Move | null, square: string): string => {
  if (move === null) return square
  if (square === move.to) return move.from
  if (move.sentinel?.to === square) return move.sentinel.from
  return square
}
export const translate = (square: string, isFlipped: boolean): CSSProperties => {
  const { file, rank } = parseSquare(square)
  const column = isFlipped ? SIZE - 1 - file : file
  const row = isFlipped ? rank - 1 : SIZE - rank
  return {
    width: SQUARE,
    height: SQUARE,
    transform: `translate(calc(${column} * ${SQUARE}), calc(${row} * ${SQUARE}))`
  }
}
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
export const arrowPoints = ({ from, to }: Step, isFlipped: boolean): string => {
  const start = centre(from, isFlipped)
  const end = centre(to, isFlipped)
  const spanX = Math.abs(end.x - start.x)
  const spanY = Math.abs(end.y - start.y)
  const isElbow = LEAP.templar.enhanced.some(
    ([file, rank]) => Math.abs(file) === spanX && Math.abs(rank) === spanY
  )
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