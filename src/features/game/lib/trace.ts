import type { SquareOccupant } from '@/types/material'
import type { Square, Trace, Step, Position } from '@/types/game'
import { SIZE } from '@/constants/board'
import { EMPEROR, MARSHAL } from '@/constants/piece'
import { EVERY } from '@/constants/direction'
import { DEST, DEST_CAPTURE, AWAKE, RIPOSTE, STAGGER } from '@/constants/style'
import { parseSquare, makeSquare, isOnBoard, isLeapOffset } from './coordinate'

const line = (from: Square, to: Square): Square[] => {
  const fileStep = Math.sign(to.file - from.file)
  const rankStep = Math.sign(to.rank - from.rank)
  const steps = Math.max(Math.abs(to.file - from.file), Math.abs(to.rank - from.rank))
  return Array.from({ length: steps + 1 }, (_, i) => ({
    file: from.file + fileStep * i,
    rank: from.rank + rankStep * i
  }))
}
const elbow = (from: Square, to: Square, isFileFirst: boolean): Square[] => {
  const corner = isFileFirst
    ? { file: to.file, rank: from.rank }
    : { file: from.file, rank: to.rank }
  return [...line(from, corner), ...line(corner, to).slice(1)]
}
const wavefronts = ({ from, to }: Step): string[][] => {
  const origin = parseSquare(from)
  const target = parseSquare(to)
  const fileSpan = Math.abs(target.file - origin.file)
  const rankSpan = Math.abs(target.rank - origin.rank)
  if (isLeapOffset(fileSpan, rankSpan)) {
    const fileFirst = elbow(origin, target, true)
    const rankFirst = elbow(origin, target, false)
    return fileFirst.map((square, step) => {
      const fileFirstSquare = makeSquare(square)
      const rankFirstSquare = makeSquare(rankFirst[step]!)
      return fileFirstSquare === rankFirstSquare
        ? [fileFirstSquare]
        : [fileFirstSquare, rankFirstSquare]
    })
  }
  return line(origin, target).map(square => [makeSquare(square)])
}
const roundTrip = ({ from, to }: Step): Trace[] => {
  const approach = wavefronts({ from, to })
  const offset = STAGGER.duration - STAGGER.each
  return [...approach, ...approach.toReversed()].flatMap((squares, step) =>
    squares.map(square => ({
      square,
      delay: step * STAGGER.each + (step >= approach.length ? offset : 0),
      colour: AWAKE
    }))
  )
}
const ray = (
  origin: Square,
  [fileStep, rankStep]: readonly [number, number],
  occupancy: SquareOccupant
): string[] => {
  const squares: string[] = []
  for (let distance = 1; distance <= SIZE; distance += 1) {
    const step = {
      file: origin.file + fileStep * distance,
      rank: origin.rank + rankStep * distance
    }
    if (!isOnBoard(step)) break
    const square = makeSquare(step)
    squares.push(square)
    if (occupancy[square]) break
  }
  return squares
}
export const emperorFlag = ({ side, pieces, emperorAttackers }: Position): Trace[] => {
  const emperor = pieces[side][EMPEROR][0] ?? null
  if (emperor === null) return []
  return emperorAttackers.flatMap(attacker => roundTrip({ from: attacker, to: emperor }))
}
export const riposteFlag = (position: Position): Trace[] => {
  const { side, pieces, occupancy, state } = position
  const marshal = pieces[side][MARSHAL][0] ?? null
  if (!state.riposte || marshal === null) return []
  return [
    { square: marshal, delay: 0, colour: RIPOSTE },
    ...EVERY.flatMap(direction =>
      ray(parseSquare(marshal), direction, occupancy).map((square, step) => ({
        square,
        delay: (step + 1) * STAGGER.each,
        colour:
          occupancy[square] === undefined
            ? RIPOSTE
            : occupancy[square].side === side
              ? DEST
              : DEST_CAPTURE
      }))
    )
  ]
}