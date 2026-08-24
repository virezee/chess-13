import type { Move, Position, Result } from '@/types/game'
import { useState, useEffect } from 'react'
import { FILES, RANKS, COMMAND_SQUARE } from '@/constants/board'
import { POPE } from '@/constants/piece'
import { CHECKMATE } from '@/constants/outcome'
import { COORDS, SQUARE } from '@/constants/style'
import { CommandSquare, Surface, Overlay, Destinations } from './Square'
import { Pieces } from './Pieces'
import { Arrows } from './Arrows'
import { remapIds } from '../../lib/view'

type BoardProps = {
  position: Position
  lastMove: Move | null
  selected: string | null
  targets: string[]
  marks: Record<string, string>
  arrows: Record<string, string>
  isFlipped: boolean
  result: Result | null
  onSelect: (square: string) => void
  onMark: (square: string, colour: string) => void
  onArrow: (from: string, to: string, colour: string) => void
}
function Files({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateColumns: `repeat(13, ${SQUARE})` }}>
      {(isFlipped ? FILES.toReversed() : FILES).map(file => (
        <span key={file} className='flex justify-center pt-2'>
          {file}
        </span>
      ))}
    </div>
  )
}
function Ranks({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div
      className='grid font-mono text-[10px] text-ink-faint'
      style={{ gridTemplateRows: `repeat(13, ${SQUARE})` }}>
      {(isFlipped ? RANKS : RANKS.toReversed()).map(rank => (
        <span key={rank} className='flex items-center justify-end pr-2'>
          {rank}
        </span>
      ))}
    </div>
  )
}
function Board({
  position,
  lastMove,
  selected,
  targets,
  marks,
  arrows,
  ids,
  snap,
  isFlipped,
  isAnimated,
  result,
  onSelect,
  onMark,
  onArrow
}: BoardProps & { ids: Map<string, number>; snap: Move | null; isAnimated: boolean }) {
  const { pieces, occupancy, side, checkers, enhanced } = position
  const check = checkers.length === 0 ? null : pieces[side][POPE][0]!
  return (
    <Surface isFlipped={isFlipped} onSelect={onSelect} onMark={onMark} onArrow={onArrow}>
      <CommandSquare isOccupied={occupancy[COMMAND_SQUARE] !== undefined} />
      <Overlay
        lastMove={lastMove}
        check={check}
        selected={selected}
        marks={marks}
        isFlipped={isFlipped}
      />
      <Pieces
        occupancy={occupancy}
        ids={ids}
        snap={snap}
        enhanced={enhanced}
        isFlipped={isFlipped}
        isAnimated={isAnimated}
        fallen={result?.reason === CHECKMATE ? check : null}
      />
      <Arrows arrows={arrows} isFlipped={isFlipped} />
      <Destinations occupancy={occupancy} targets={targets} isFlipped={isFlipped} />
    </Surface>
  )
}
export function BoardFrame({ lastMove, isFlipped, ...board }: BoardProps) {
  const { occupancy } = board.position
  const [prev, setPrev] = useState({ move: lastMove, occupancy })
  const [keys, setKeys] = useState(() => remapIds(new Map<string, number>(), occupancy, null, 0))
  const [snap, setSnap] = useState<Move | null>(null)
  const [orientation, setOrientation] = useState({ flipped: isFlipped, immediate: false })
  if (prev.move !== lastMove || prev.occupancy !== occupancy) {
    const played = prev.move === lastMove ? null : lastMove
    setPrev({ move: lastMove, occupancy })
    setKeys(current => remapIds(current.ids, occupancy, played, current.lastId))
    setSnap(played)
  }
  if (orientation.flipped !== isFlipped) setOrientation({ flipped: isFlipped, immediate: true })
  useEffect(() => {
    const settled = snap === null && !orientation.immediate
    const frame = settled
      ? null
      : requestAnimationFrame(() => {
          setSnap(null)
          setOrientation(current => ({ ...current, immediate: false }))
        })
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [snap, orientation.immediate])
  return (
    <div className='@container w-full select-none overflow-x-auto'>
      <div
        className='grid w-fit'
        style={{ gridTemplateColumns: `${COORDS} auto`, gridTemplateRows: `auto ${COORDS}` }}>
        <Ranks isFlipped={isFlipped} />
        <Board
          {...board}
          ids={keys.ids}
          lastMove={lastMove}
          snap={snap}
          isFlipped={isFlipped}
          isAnimated={snap === null && !orientation.immediate}
        />
        <div />
        <Files isFlipped={isFlipped} />
      </div>
    </div>
  )
}