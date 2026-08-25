import type { MouseEvent, CSSProperties } from 'react'
import type { SquareOccupant } from '@/types/material'
import type { Move } from '@/types/game'
import { SIZE } from '@/constants/board'
import { SQUARE } from '@/constants/style'
import { parseSquare, makeSquare } from './coordinate'

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