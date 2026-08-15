'use client'

import { useMemo, useState } from 'react'
import type { Side, Position } from '@/types/material'
import type { Move, Rights, PromotionSlot } from '@/types/game'
import { WHITE, BLACK } from '@/constants/colour'
import { Board } from '@/features/game/components/Board'
import { ArmyPanel } from '@/features/game/components/ArmyPanel'
import { MoveLog } from '@/features/game/components/MoveLog'
import { GameStatus } from '@/features/game/components/GameStatus'
import { turn } from '@/features/game/engine/turn'
import { legality } from '@/features/game/engine/legality'
import { apply } from '@/features/game/engine/apply'
import {
  blackArmy,
  whiteArmy,
  position as opening,
  moveLog,
  counters,
  swapAvailable
} from '@/features/game/mock'

export default function Home() {
  const [side, setSide] = useState<Side>(WHITE)
  const [position, setPosition] = useState<Position>(opening)
  const [rights, setRights] = useState<Rights>({
    castling: { [WHITE]: { left: true, right: true }, [BLACK]: { left: true, right: true } },
    enPassant: null
  })
  const [slots, setSlots] = useState<Record<Side, PromotionSlot[]>>({ [WHITE]: [], [BLACK]: [] })
  const [idle, setIdle] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [last, setLast] = useState<{ position: Position; move: Move } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [marks, setMarks] = useState<Record<string, string>>({})

  const mark = (square: string, colour: string) =>
    setMarks(current => {
      const next = { ...current }
      if (next[square] === colour) delete next[square]
      else next[square] = colour
      return next
    })

  const state = useMemo(
    () =>
      turn(
        side,
        position,
        last,
        rights.castling[side],
        rights.enPassant,
        slots[side],
        history,
        idle
      ),
    [side, position, last, rights, slots, history, idle]
  )
  const moves = useMemo(() => legality(state), [state])
  const targets =
    selected === null ? [] : moves.filter(move => move.from === selected).map(move => move.to)

  const select = (square: string) => {
    setMarks({})
    const move =
      selected === null
        ? undefined
        : moves.find(candidate => candidate.from === selected && candidate.to === square)
    if (!move) {
      setSelected(state.position[square]?.side === side ? square : null)
      return
    }
    const next = apply(state.position, move, rights, slots, idle)
    setLast({ position: state.position, move })
    setPosition(next.position)
    setRights(next.rights)
    setSlots(next.slots)
    setIdle(next.idle)
    setHistory([...history, state.key])
    setSide(side === WHITE ? BLACK : WHITE)
    setSelected(null)
  }

  const materialGap = whiteArmy.material - blackArmy.material
  return (
    <main className='mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-[18.5rem_minmax(0,1fr)_20rem] xl:gap-5 xl:px-5 xl:py-5'>
      <aside className='order-2 flex flex-col gap-4 lg:order-2 xl:order-1'>
        <ArmyPanel army={blackArmy} active={side === BLACK} delta={-materialGap} />
        <ArmyPanel army={whiteArmy} active={side === WHITE} delta={materialGap} />
      </aside>
      <div className='order-1 flex justify-center lg:col-span-2 xl:order-2 xl:col-span-1'>
        <Board
          position={state.position}
          selected={selected}
          targets={targets}
          lastMove={last?.move ?? null}
          marks={marks}
          onSelect={select}
          onMark={mark}
        />
      </div>
      <aside className='order-3 flex flex-col gap-4'>
        <MoveLog turns={moveLog} toMove={side} />
        <GameStatus counters={counters} swapAvailable={swapAvailable} />
      </aside>
    </main>
  )
}
