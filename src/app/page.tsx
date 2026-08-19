'use client'

import { useMemo, useState } from 'react'
import type { Side, SquareOccupant } from '@/types/material'
import type { Move, State, Save } from '@/types/game'
import type { FullMove } from '@/types/panel'
import { SIZE, FILES } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { EMPEROR, LEGIONARY, BACK_RANK } from '@/constants/piece'
import { PLIES_PER_MOVE, NO_PROGRESS_BASE } from '@/constants/outcome'
import { BoardFrame } from '@/features/game/components/Board'
import { ArmyPanel } from '@/features/game/components/ArmyPanel'
import { MoveList } from '@/features/game/components/MoveList'
import { GameStatus } from '@/features/game/components/GameStatus'
import { turn } from '@/features/game/engine/turn'
import { canSwap, takeSwap } from '@/features/game/engine/apply'
import { repetitionKey } from '@/features/game/engine/outcome'
import { notation } from '@/features/game/engine/notation'

const PLAYERS = { [WHITE]: 'Player 1', [BLACK]: 'Player 2' }

/** One side as it stands before the first move: a back rank and a rank of Legionaries. */
const setup = (side: Side, back: number, legionaries: number): SquareOccupant => {
  const squares: SquareOccupant = {}
  BACK_RANK.forEach((piece, file) => {
    squares[`${FILES[file]}${back}`] =
      piece === EMPEROR ? { side, piece, awake: false } : { side, piece }
    squares[`${FILES[file]}${legionaries}`] = { side, piece: LEGIONARY }
  })
  return squares
}
const opening = (): Save => {
  const occupancy = { ...setup(WHITE, 1, 3), ...setup(BLACK, SIZE, SIZE - 2) }
  const state: State = {
    awake: { [WHITE]: false, [BLACK]: false },
    riposte: false,
    castlingSide: {
      [WHITE]: { left: true, right: true },
      [BLACK]: { left: true, right: true }
    },
    promotions: { [WHITE]: [], [BLACK]: [] },
    enPassant: null,
    noProgress: { count: 0, limit: NO_PROGRESS_BASE * PLIES_PER_MOVE }
  }
  return {
    side: WHITE,
    occupancy,
    state,
    match: {
      swap: true,
      whitePlayer: null,
      history: [repetitionKey(WHITE, occupancy, state)],
      pgn: ''
    }
  }
}

export default function Home() {
  const [save, setSave] = useState<Save>(opening)
  const [last, setLast] = useState<Move | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [choices, setChoices] = useState<Move[]>([])
  const [marks, setMarks] = useState<Record<string, string>>({})
  const [log, setLog] = useState<FullMove[]>([])
  const [pending, setPending] = useState<'resign' | 'new' | null>(null)

  const { position, moves, outcome } = useMemo(() => turn(save, null), [save])
  // Black is offered white before its first move, and the offer holds the board:
  // moving a piece would answer the question by accident.
  const swapAsked = canSwap(position, save.match)
  // Taking the offer moves both players, not one: whoever was black now sits behind
  // white, and the name that was white is the one left behind black.
  const seat = {
    [WHITE]: save.match.whitePlayer ?? PLAYERS[WHITE],
    [BLACK]: save.match.whitePlayer === null ? PLAYERS[BLACK] : PLAYERS[WHITE]
  }

  const mark = (square: string, colour: string) =>
    setMarks(current => {
      const next = { ...current }
      if (next[square] === colour) delete next[square]
      else next[square] = colour
      return next
    })
  const play = (move: Move) => {
    // Written from the board the move is played on, before it is applied, since the piece
    // that moves and the Marshal that reads it are both still where the notation names them.
    const written = notation(position, move)
    setLog(current => {
      const open = current[current.length - 1]
      if (position.side === BLACK && open && open.black === null)
        return current.map((entry, index) =>
          index === current.length - 1 ? { ...entry, black: written } : entry
        )
      return [...current, { number: current.length + 1, white: written, black: null }]
    })
    setSave(turn(save, move).save)
    setLast(move)
    setSelected(null)
    setChoices([])
    setMarks({})
  }
  const select = (square: string) => {
    if (swapAsked || pending !== null) return
    setMarks({})
    setChoices([])
    if (selected !== null) {
      // A Legionary reaching the last rank can hold several slots within reach, so one pair
      // of squares may carry more than one move and the player picks between them.
      const reached = moves.filter(move => move.from === selected && move.to === square)
      if (reached.length > 1) {
        setChoices(reached)
        return
      }
      if (reached.length === 1) {
        play(reached[0]!)
        return
      }
    }
    setSelected(position.occupancy[square]?.side === position.side ? square : null)
  }

  // Several moves can end on one square, a promotion offering more than one piece
  // being the usual case, and the board draws one dot per square.
  const targets =
    selected === null
      ? []
      : [...new Set(moves.filter(move => move.from === selected).map(move => move.to))]
  return (
    <main className='mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-[18.5rem_minmax(0,1fr)_20rem] xl:gap-5 xl:px-5 xl:py-5'>
      <aside className='order-2 flex flex-col gap-4 lg:order-2 xl:order-1'>
        <ArmyPanel
          player={seat[WHITE]}
          position={position}
          side={WHITE}
          active={position.side === WHITE}
        />
        <ArmyPanel
          player={seat[BLACK]}
          position={position}
          side={BLACK}
          active={position.side === BLACK}
        />
      </aside>
      <div className='order-1 flex justify-center lg:col-span-2 xl:order-2 xl:col-span-1'>
        <BoardFrame
          occupancy={position.occupancy}
          selected={selected}
          targets={targets}
          lastMove={last}
          marks={marks}
          onSelect={select}
          onMark={mark}
        />
      </div>
      <aside className='order-3 flex flex-col gap-4'>
        {choices.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 rounded border border-line bg-surface px-3 py-2'>
            <span className='text-[11px] uppercase tracking-[0.16em] text-ink-faint'>
              Promote To?
            </span>
            {choices.map(move => (
              <button
                key={move.promotesTo}
                type='button'
                onClick={() => play(move)}
                className='rounded-xs border border-line-strong bg-surface-2 px-2 py-1 text-[11px] capitalize text-ink-dim hover:text-ink'>
                {move.promotesTo}
              </button>
            ))}
          </div>
        )}
        {outcome !== null && (
          <p className='rounded border border-line bg-surface px-3 py-2 text-[12px] text-ink'>
            {outcome.reason}
            {outcome.winner === null ? '' : `, ${outcome.winner} wins`}
          </p>
        )}
        <MoveList moves={log} toMove={position.side} />
        <GameStatus
          position={position}
          history={save.match.history}
          canSwap={canSwap(position, save.match)}
          onDecline={() => setSave({ ...save, match: { ...save.match, swap: false } })}
          onAccept={() => setSave(takeSwap(position, save.match, PLAYERS[BLACK]))}
          pending={pending}
          setPending={setPending}
          onNewGame={() => {
            setSave(opening())
            setLog([])
            setLast(null)
            setSelected(null)
            setChoices([])
            setMarks({})
          }}
        />
      </aside>
    </main>
  )
}