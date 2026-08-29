import type { Move, Position, Result } from '@/types/game'
import { useState } from 'react'
import { BLACK } from '@/constants/player'
import { AUTO } from '@/constants/display'
import { clickSquares } from '../engine/turn'
import { Grid } from './board/Grid'
import { mark, markColour } from '../lib/annotation'
import { emperorFlag, riposteFlag } from '../lib/trace'
import { useFlip } from '@/lib/flip'

type BoardProps = {
  position: Position
  lastMove: Move | null
  locked: boolean
  moves: Move[]
  result: Result | null
  onMove: (move: Move) => void
  onPromotions: (moves: Move[]) => void
}
export function Board(props: BoardProps) {
  const { position, lastMove, locked, moves, result, onMove, onPromotions } = props
  const [selected, setSelected] = useState<string | null>(null)
  const [marks, setMarks] = useState<Record<string, string>>({})
  const [arrows, setArrows] = useState<Record<string, string>>({})
  const isFlipped = useFlip() === AUTO && position.side === BLACK
  const select = (square: string) => {
    if (locked) return
    setMarks({})
    setArrows({})
    const reached = moves.filter(
      move => move.from === selected && clickSquares(position.occupancy, move).includes(square)
    )
    onPromotions(reached.length > 1 ? reached : [])
    if (reached.length === 1) {
      setSelected(null)
      onMove(reached[0]!)
    } else if (reached.length === 0)
      setSelected(position.occupancy[square]?.side === position.side ? square : null)
  }
  return (
    <div className='order-1 flex justify-center lg:col-span-2 xl:order-2 xl:col-span-1'>
      <Grid
        position={position}
        lastMove={lastMove}
        selected={selected}
        targets={[
          ...new Set(
            moves
              .filter(move => move.from === selected)
              .flatMap(move => clickSquares(position.occupancy, move))
          )
        ]}
        marks={marks}
        arrows={arrows}
        trace={[...emperorFlag(position), ...riposteFlag(position)]}
        isFlipped={isFlipped}
        result={result}
        onSelect={select}
        onMark={(square, event) => setMarks(current => mark(current, square, markColour(event)))}
        onArrow={(from, to, event) =>
          setArrows(current => mark(current, `${from}-${to}`, markColour(event)))
        }
      />
    </div>
  )
}