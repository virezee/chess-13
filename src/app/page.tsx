'use client'

import type { Move, Save, Position } from '@/types/game'
import { useState, useMemo, useEffect } from 'react'
import { canSwap } from '@/features/game/engine/apply'
import { opening, turn } from '@/features/game/engine/turn'
import { readSave, writeSave, clearSave } from '@/features/game/lib/save'
import { Board } from '@/features/game/components/Board'
import { Panel } from '@/features/game/components/Panel'

const takeResign = (
  save: Save,
  setSave: (save: Save) => void,
  setPromotions: (moves: Move[]) => void,
  position: Position
): void => {
  setSave({ ...save, match: { ...save.match, resigned: position.side } })
  setPromotions([])
  clearSave()
}
const takeNewGame = (
  setSave: (save: Save) => void,
  setPromotions: (moves: Move[]) => void,
  setKey: (next: (round: number) => number) => void
): void => {
  setSave(opening())
  setPromotions([])
  setKey(round => round + 1)
  clearSave()
}
export default function Home() {
  const [load, setLoad] = useState(false)
  const [save, setSave] = useState<Save>(opening)
  const [promotions, setPromotions] = useState<Move[]>([])
  const [pending, setPending] = useState<'resign' | 'new' | null>(null)
  const [key, setKey] = useState(0)
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
      <Board
        key={key}
        position={load ? position : { ...position, occupancy: {} }}
        lastMove={save.match.lastMove}
        locked={canSwap(position, save.match) || result !== null || pending !== null}
        moves={moves}
        result={result}
        onMove={playMove}
        onPromotions={setPromotions}
      />
      <Panel
        save={save}
        setSave={setSave}
        position={position}
        promotions={promotions}
        pending={pending}
        setPending={setPending}
        result={result}
        onMove={playMove}
        onResign={() => takeResign(save, setSave, setPromotions, position)}
        onNewGame={() => takeNewGame(setSave, setPromotions, setKey)}
      />
    </main>
  )
}