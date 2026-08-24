import type { Move, Position, Match, Save, Result } from '@/types/game'
import { WHITE, BLACK, NAMES } from '@/constants/player'
import { canSwap, takeSwap } from '../engine/apply'
import { ArmyInfo } from './panel/ArmyInfo'
import { MoveList } from './panel/MoveList'
import { GameStatus } from './panel/GameStatus'
import { writeSave } from '../lib/save'

type PanelProps = {
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
}
function Armies({ position, match }: { position: Position; match: Match }) {
  const player = {
    [WHITE]: match.whitePlayer ?? NAMES[WHITE],
    [BLACK]: match.whitePlayer === null ? NAMES[BLACK] : NAMES[WHITE]
  }
  return (
    <aside className='order-2 flex flex-col gap-4 lg:order-2 xl:order-1'>
      <ArmyInfo
        player={player[WHITE]}
        position={position}
        side={WHITE}
        active={position.side === WHITE}
      />
      <ArmyInfo
        player={player[BLACK]}
        position={position}
        side={BLACK}
        active={position.side === BLACK}
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
function Control(props: PanelProps) {
  const { save, setSave, position, promotions, result, onMove } = props
  return (
    <aside className='order-3 flex flex-col gap-4'>
      <Promotions promotions={promotions} onPick={onMove} />
      <MoveList pgn={save.match.pgn} toMove={position.side} />
      <GameStatus
        position={position}
        history={save.match.history}
        canSwap={canSwap(position, save.match)}
        pending={props.pending}
        setPending={props.setPending}
        result={result}
        onDecline={() => {
          const next = { ...save, match: { ...save.match, swap: false } }
          setSave(next)
          writeSave(next)
        }}
        onAccept={() => {
          const next = takeSwap(position, save.match, NAMES[BLACK])
          setSave(next)
          writeSave(next)
        }}
        onResign={props.onResign}
        onNewGame={props.onNewGame}
      />
    </aside>
  )
}
export function Panel(props: PanelProps) {
  return (
    <>
      <Armies position={props.position} match={props.save.match} />
      <Control {...props} />
    </>
  )
}