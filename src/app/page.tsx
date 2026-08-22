'use client'

import type { Move, Save, Match, Position, Result } from '@/types/game'
import { useState, useMemo, useEffect } from 'react'
import { WHITE, BLACK } from '@/constants/colour'
import { opening, turn } from '@/features/game/engine/turn'
import { canSwap, takeSwap } from '@/features/game/engine/apply'
import { BoardFrame } from '@/features/game/components/Board'
import { ArmyPanel } from '@/features/game/components/ArmyPanel'
import { MoveList } from '@/features/game/components/MoveList'
import { GameStatus } from '@/features/game/components/GameStatus'
import { readSave, writeSave, clearSave } from '@/features/game/lib/save'

const players = { [WHITE]: 'Player 1', [BLACK]: 'Player 2' }
const targets = (moves: Move[], selected: string | null): string[] => [
  ...new Set(moves.filter(move => move.from === selected).map(move => move.to))
]
const mark = (
  marks: Record<string, string>,
  square: string,
  colour: string
): Record<string, string> => {
  const next = { ...marks }
  if (next[square] === colour) delete next[square]
  else next[square] = colour
  return next
}
const takeResign = (save: Save, setSave: (save: Save) => void, position: Position): void => {
  setSave({ ...save, match: { ...save.match, resigned: position.side } })
  clearSave()
}
const takeNewGame = (
  setSave: (save: Save) => void,
  setPromotions: (moves: Move[]) => void
): void => {
  setSave(opening())
  setPromotions([])
  clearSave()
}
function Board({
  position,
  lastMove,
  locked,
  moves,
  result,
  onMove,
  onPromotions
}: {
  position: Position
  lastMove: Move | null
  locked: boolean
  moves: Move[]
  result: Result | null
  onMove: (move: Move) => void
  onPromotions: (moves: Move[]) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [marks, setMarks] = useState<Record<string, string>>({})
  const select = (square: string) => {
    if (locked) return
    setMarks({})
    const reached = moves.filter(move => move.from === selected && move.to === square)
    onPromotions(reached.length > 1 ? reached : [])
    if (reached.length === 1) {
      setSelected(null)
      onMove(reached[0]!)
    } else if (reached.length === 0)
      setSelected(position.occupancy[square]?.side === position.side ? square : null)
  }
  return (
    <div className='order-1 flex justify-center lg:col-span-2 xl:order-2 xl:col-span-1'>
      <BoardFrame
        position={position}
        lastMove={lastMove}
        selected={selected}
        targets={targets(moves, selected)}
        marks={marks}
        result={result}
        onSelect={select}
        onMark={(square, colour) => setMarks(current => mark(current, square, colour))}
      />
    </div>
  )
}
function Armies({ position, match }: { position: Position; match: Match }) {
  const player = {
    [WHITE]: match.whitePlayer ?? players[WHITE],
    [BLACK]: match.whitePlayer === null ? players[BLACK] : players[WHITE]
  }
  return (
    <aside className='order-2 flex flex-col gap-4 lg:order-2 xl:order-1'>
      <ArmyPanel
        player={player[WHITE]}
        position={position}
        side={WHITE}
        active={position.side === WHITE}
      />
      <ArmyPanel
        player={player[BLACK]}
        position={position}
        side={BLACK}
        active={position.side === BLACK}
      />
    </aside>
  )
}
function Control({
  save,
  setSave,
  position,
  promotions,
  pending,
  setPending,
  result,
  onMove,
  onResign,
  onNewGame
}: {
  save: Save
  setSave: (save: Save) => void
  position: Position
  promotions: Move[]
  pending: 'resign' | 'new' | null
  setPending: (pending: 'resign' | 'new' | null) => void
  result: Result | null
  onMove: (move: Move) => void
  onResign: () => void
  onNewGame: () => void
}) {
  return (
    <aside className='order-3 flex flex-col gap-4'>
      <Promotions promotions={promotions} onPick={onMove} />
      <MoveList pgn={save.match.pgn} toMove={position.side} />
      <GameStatus
        position={position}
        history={save.match.history}
        result={result}
        canSwap={canSwap(position, save.match)}
        onDecline={() => {
          const next = { ...save, match: { ...save.match, swap: false } }
          setSave(next)
          writeSave(next)
        }}
        onAccept={() => {
          const next = takeSwap(position, save.match, players[BLACK])
          setSave(next)
          writeSave(next)
        }}
        pending={pending}
        setPending={setPending}
        onResign={onResign}
        onNewGame={onNewGame}
      />
    </aside>
  )
}
function Promotions({ promotions, onPick }: { promotions: Move[]; onPick: (move: Move) => void }) {
  if (promotions.length === 0) return null
  return (
    <div className='flex flex-wrap items-center gap-2 rounded border border-line bg-surface px-3 py-2'>
      <span className='text-[11px] uppercase tracking-[0.16em] text-ink-faint'>Promote To?</span>
      {promotions.map(move => (
        <button
          key={move.promotesTo}
          type='button'
          onClick={() => onPick(move)}
          className='rounded-xs border border-line-strong bg-surface-2 px-2 py-1 text-[11px] capitalize text-ink-dim hover:text-ink'>
          {move.promotesTo}
        </button>
      ))}
    </div>
  )
}
export default function Home() {
  const [load, setLoad] = useState(false)
  const [save, setSave] = useState<Save>(opening)
  const [promotions, setPromotions] = useState<Move[]>([])
  const [pending, setPending] = useState<'resign' | 'new' | null>(null)
  const { position, moves, result } = useMemo(() => turn(save, null), [save])
  useEffect(() => {
    const stored = readSave()
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== null) setSave(stored)
    setLoad(true)
  }, [])
  const playMove = (move: Move) => {
    const next = turn(save, move)
    setSave(next.save)
    setPromotions([])
    if (next.result === null) writeSave(next.save)
    else clearSave()
  }
  return (
    <main className='mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-[18.5rem_minmax(0,1fr)_20rem] xl:gap-5 xl:px-5 xl:py-5'>
      <Armies position={position} match={save.match} />
      <Board
        position={load ? position : { ...position, occupancy: {} }}
        lastMove={save.match.lastMove}
        locked={canSwap(position, save.match) || result !== null || pending !== null}
        moves={moves}
        result={result}
        onMove={playMove}
        onPromotions={setPromotions}
      />
      <Control
        save={save}
        setSave={setSave}
        position={position}
        promotions={promotions}
        pending={pending}
        setPending={setPending}
        result={result}
        onMove={playMove}
        onResign={() => takeResign(save, setSave, position)}
        onNewGame={() => takeNewGame(setSave, setPromotions)}
      />
    </main>
  )
}