import type { MouseEvent, CSSProperties } from 'react'
import type { SquareOccupant } from '@/types/material'
import type { Move, View, Position, Result } from '@/types/game'
import { useState } from 'react'
import Image from 'next/image'
import { SIZE, FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { POPE } from '@/constants/piece'
import { CHECKMATE } from '@/constants/outcome'
import {
  COORDS,
  SQUARE,
  BOARD,
  PATTERN,
  FONT_SIZE,
  BASELINE,
  BUFF,
  SELECTED,
  DEST,
  DEST_CAPTURE,
  CHECK,
  MARKS
} from '@/constants/style'
import { parseSquare, makeSquare } from '../lib/coordinate'
import { cn } from '@/lib/cn'

type BoardProps = {
  position: Position
  selected: string | null
  targets: string[]
  marks: Record<string, string>
  result: Result | null
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
}
const squareFromEvent = (event: MouseEvent<HTMLDivElement>): string => {
  const box = event.currentTarget.getBoundingClientRect()
  const file = Math.min(SIZE - 1, Math.floor(((event.clientX - box.left) / box.width) * SIZE))
  const rank =
    SIZE - Math.min(SIZE - 1, Math.floor(((event.clientY - box.top) / box.height) * SIZE))
  return makeSquare({ file, rank })
}
const remapIds = (
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
const translate = (square: string): CSSProperties => {
  const { file, rank } = parseSquare(square)
  return {
    width: SQUARE,
    height: SQUARE,
    transform: `translate(calc(${file} * ${SQUARE}), calc(${SIZE - rank} * ${SQUARE}))`
  }
}
const markColour = (event: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }): string =>
  event.ctrlKey
    ? MARKS.yellow
    : event.shiftKey
      ? MARKS.green
      : event.altKey
        ? MARKS.blue
        : MARKS.red
function Files() {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateColumns: `repeat(13, ${SQUARE})` }}>
      {FILES.map(file => (
        <span key={file} className='flex justify-center pt-2'>
          {file}
        </span>
      ))}
    </div>
  )
}
function Ranks() {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateRows: `repeat(13, ${SQUARE})` }}>
      {RANKS.toReversed().map(rank => (
        <span key={rank} className='flex items-center justify-end pr-2'>
          {rank}
        </span>
      ))}
    </div>
  )
}
function CommandSquare({ isOccupied }: { isOccupied: boolean }) {
  return (
    <div
      className='pointer-events-none absolute left-0 top-0 select-none bg-square-command'
      style={translate(COMMAND_SQUARE)}>
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid meet'
        className={cn('h-full w-full', isOccupied ? 'opacity-25' : 'opacity-70')}
        aria-hidden>
        <text
          x='50'
          y={BASELINE}
          textAnchor='middle'
          fontSize={FONT_SIZE}
          className='fill-square-command-ink font-command'>
          M
        </text>
      </svg>
    </div>
  )
}
function PieceImage({
  piece,
  square,
  isBuffed,
  isFallen
}: Required<View>['moved'] & { isBuffed: boolean; isFallen: boolean }) {
  return (
    <div
      className='absolute left-0 top-0 cursor-pointer transition-transform duration-300 ease-out'
      style={{ ...translate(square), willChange: 'transform', zIndex: 1 }}>
      {isBuffed && (
        <span
          className='pointer-events-none absolute inset-0'
          style={{
            background: BUFF[piece.side],
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
          }}
        />
      )}
      <Image
        key={`${piece.side}/${piece.piece}`}
        src={`/${piece.side}/${piece.piece}.png`}
        alt={`${piece.side} ${piece.piece}`}
        fill
        sizes={SQUARE}
        loading='eager'
        draggable={false}
        className={cn('select-none object-contain', isFallen && 'checkmate-fall')}
      />
    </div>
  )
}
function Highlight({
  square,
  backgroundColour,
  isInteractive
}: {
  square: string
  backgroundColour: string
  isInteractive?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0',
        isInteractive ? 'cursor-pointer' : 'pointer-events-none'
      )}
      style={{
        ...translate(square),
        background: backgroundColour,
        zIndex: isInteractive ? 3 : undefined
      }}
    />
  )
}
function Destinations({ occupancy, targets }: { occupancy: SquareOccupant; targets: string[] }) {
  return targets.map(square => (
    <Highlight
      key={square}
      square={square}
      backgroundColour={occupancy[square] ? DEST_CAPTURE : DEST}
      isInteractive
    />
  ))
}
function Board({
  position,
  selected,
  targets,
  marks,
  ids,
  result,
  onSelect,
  onMark
}: BoardProps & { ids: Map<string, number> }) {
  const { pieces, occupancy, side, checkInfo, buff } = position
  const check = checkInfo.checkers.length === 0 ? null : pieces[side][POPE][0]!
  const isCheckmate = result?.reason === CHECKMATE
  return (
    <div
      className='relative overflow-hidden rounded-[3px] outline outline-square-edge'
      style={{
        width: BOARD,
        height: BOARD,
        backgroundImage: PATTERN,
        backgroundSize: `calc(2 * ${SQUARE}) calc(2 * ${SQUARE})`
      }}
      onClick={event => onSelect(squareFromEvent(event))}
      onContextMenu={event => {
        event.preventDefault()
        onMark(squareFromEvent(event), markColour(event))
      }}>
      <CommandSquare isOccupied={occupancy[COMMAND_SQUARE] !== undefined} />
      {check !== null && <Highlight square={check} backgroundColour={CHECK} />}
      {Object.entries(marks).map(([square, colour]) => (
        <Highlight key={square} square={square} backgroundColour={colour} />
      ))}
      {selected !== null && <Highlight square={selected} backgroundColour={SELECTED} />}
      {Object.entries(occupancy)
        .toSorted(([a], [b]) => (ids.get(a) ?? 0) - (ids.get(b) ?? 0))
        .map(([square, piece]) => (
          <PieceImage
            key={ids.get(square)}
            square={square}
            piece={piece}
            isBuffed={buff.has(square)}
            isFallen={isCheckmate && square === check}
          />
        ))}
      <Destinations occupancy={occupancy} targets={targets} />
    </div>
  )
}
export function BoardFrame({ lastMove, ...board }: BoardProps & { lastMove: Move | null }) {
  const { occupancy } = board.position
  const [prev, setPrev] = useState({ move: lastMove, occupancy })
  const [keys, setKeys] = useState(() => remapIds(new Map<string, number>(), occupancy, null, 0))
  if (prev.move !== lastMove || prev.occupancy !== occupancy) {
    const played = prev.move === lastMove ? null : lastMove
    setPrev({ move: lastMove, occupancy })
    setKeys(current => remapIds(current.ids, occupancy, played, current.lastId))
  }
  return (
    <div className='@container w-full select-none overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `${COORDS} auto`, gridTemplateRows: `auto ${COORDS}` }}>
        <Ranks />
        <Board {...board} ids={keys.ids} />
        <div />
        <Files />
      </div>
    </div>
  )
}