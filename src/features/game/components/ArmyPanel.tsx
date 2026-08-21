import type { Side, PieceName, PieceSquares } from '@/types/material'
import type { Position } from '@/types/game'
import type { ArmyState } from '@/types/panel'
import { SIZE, FILES, COMMAND_SQUARE } from '@/constants/board'
import { WHITE, BLACK } from '@/constants/colour'
import { POPE, EMPEROR, MARSHAL, LEGIONARY, BACK_RANK, LETTER, VALUE } from '@/constants/piece'
import { ENHANCED, RESTRICTED } from '@/constants/zone'
import { isEnhanced } from '../engine/generate'
import { cn } from '@/lib/cn'

const captured = (pieces: PieceSquares): ArmyState['captured'] =>
  Object.entries(
    (() => {
      const count: Partial<Record<PieceName, number>> = { [LEGIONARY]: SIZE }
      for (const piece of BACK_RANK) count[piece] = (count[piece] ?? 0) + 1
      return count
    })()
  ).flatMap(([name, start]) =>
    Array.from({ length: (start ?? 0) - pieces[name as PieceName].length }, (_, i) => ({
      id: `${name}${i}`,
      letter: LETTER[name as PieceName]
    }))
  )
const fileRange = (file: number) => {
  const first = Math.max(0, file - 1)
  const last = Math.min(FILES.length - 1, file + 1)
  return `${FILES[first]}-${FILES[last]}`
}
const material = (position: Position, side: Side): number => {
  const marshalSq = position.pieces[side][MARSHAL][0] ?? null
  return Object.entries(position.occupancy).reduce(
    (total, [square, piece]) =>
      piece.side !== side || piece.piece === POPE
        ? total
        : total + VALUE[piece.piece][isEnhanced(marshalSq, square) ? ENHANCED : RESTRICTED],
    0
  )
}
const army = (position: Position, side: Side, player: string): ArmyState => {
  const { pieces, occupancy, state } = position
  const marshalSquare = pieces[side][MARSHAL][0] ?? null
  const emperorSq = pieces[side][EMPEROR][0] ?? null
  const remaining = Object.entries(occupancy).filter(
    ([, piece]) =>
      piece.side === side &&
      piece.piece !== POPE &&
      piece.piece !== EMPEROR &&
      piece.piece !== MARSHAL
  )
  return {
    player,
    side,
    emperor: emperorSq === null ? null : occupancy[emperorSq]?.awake === true ? 'awake' : 'dormant',
    marshalSquare,
    commandZone:
      marshalSquare === null ? 'none' : marshalSquare === COMMAND_SQUARE ? 'full' : 'partial',
    pieceCount: remaining.length,
    enhancedCount: remaining.filter(([square]) => isEnhanced(marshalSquare, square)).length,
    captured: captured(pieces[side]),
    promotions: state.promotions[side],
    material: material(position, side)
  }
}
function Field({
  label,
  trailing,
  children
}: {
  label: string
  trailing?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className='border-t border-line px-3.5 py-3'>
      <div className='flex items-baseline justify-between gap-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          {label}
        </p>
        {trailing}
      </div>
      <div className='mt-2'>{children}</div>
    </div>
  )
}
function Player({ armyState, active }: { armyState: ArmyState; active: boolean }) {
  return (
    <header className='flex items-center justify-between gap-3 px-3.5 py-3'>
      <div className='flex items-center gap-2.5'>
        <span
          aria-hidden
          className={cn(
            'h-2.5 w-2.5 rounded-full border border-line-strong',
            armyState.side === WHITE ? 'bg-army-white' : 'bg-army-black'
          )}
        />
        <div className='leading-tight'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-ink'>
            {armyState.side}
          </p>
          <p className='text-[11px] text-ink-faint'>{armyState.player}</p>
        </div>
      </div>
      {active && (
        <span className='rounded-xs border border-brass-deep bg-brass/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brass'>
          To move
        </span>
      )}
    </header>
  )
}
function EmperorField({ armyState }: { armyState: ArmyState }) {
  return (
    <Field label='Emperor'>
      {armyState.emperor === null ? (
        <p className='text-[12px] text-ink-faint'>Captured</p>
      ) : (
        <div className='rounded-[3px] border border-line bg-surface-2 px-3 py-2.5'>
          <span
            className={cn(
              'text-[11px] font-semibold uppercase tracking-[0.12em]',
              armyState.emperor === 'awake' ? 'text-brass' : 'text-ink-faint'
            )}>
            {armyState.emperor}
          </span>
        </div>
      )}
    </Field>
  )
}
function ZoneMeter({ armyState }: { armyState: ArmyState }) {
  const ratio = armyState.pieceCount === 0 ? 0 : armyState.enhancedCount / armyState.pieceCount
  return (
    <div
      className={cn(
        'rounded-[3px] border px-3 py-2.5',
        armyState.commandZone === 'full' && 'border-brass-deep bg-brass/8',
        armyState.commandZone === 'partial' && 'border-line-strong bg-surface-2',
        armyState.commandZone === 'none' && 'border-alert/40 bg-alert/8'
      )}>
      <div className='flex items-baseline justify-between gap-3'>
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.12em]',
            armyState.commandZone === 'none' ? 'text-alert' : 'text-brass'
          )}>
          {armyState.commandZone === 'full'
            ? 'Command Square'
            : armyState.commandZone === 'partial'
              ? 'Command Zone'
              : 'Marshal Captured'}
        </span>
        <span className='font-mono text-[11px] text-ink-dim'>
          {armyState.enhancedCount}
          <span className='text-ink-faint'>/{armyState.pieceCount}</span>
        </span>
      </div>
      <div className='mt-2 h-1 w-full overflow-hidden rounded-[1px] bg-track'>
        <div
          className={cn(
            'h-full transition-[width] duration-300',
            armyState.commandZone === 'none' ? 'bg-alert/60' : 'bg-brass'
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
    </div>
  )
}
function MarshalField({ armyState }: { armyState: ArmyState }) {
  return (
    <Field
      label='Marshal'
      trailing={
        <span className='font-mono text-[12px] text-ink'>{armyState.marshalSquare ?? '--'}</span>
      }>
      <ZoneMeter armyState={armyState} />
    </Field>
  )
}
function LostField({ armyState }: { armyState: ArmyState }) {
  return (
    <Field
      label='Captured'
      trailing={
        <span className='font-mono text-[11px] text-ink-faint'>{armyState.captured.length}</span>
      }>
      {armyState.captured.length === 0 ? (
        <p className='text-[12px] text-ink-faint'>Nothing yet.</p>
      ) : (
        <div className='flex flex-wrap gap-1'>
          {armyState.captured.map(piece => (
            <span
              key={piece.id}
              className='grid h-6 w-6 place-items-center rounded-xs border border-line-strong bg-surface-2 font-notation font-bold text-[11px] text-ink-dim'>
              {piece.letter}
            </span>
          ))}
        </div>
      )}
    </Field>
  )
}
function PromotionField({ armyState }: { armyState: ArmyState }) {
  return (
    <Field label='Promotion Slots'>
      {armyState.promotions.length === 0 ? (
        <p className='text-[12px] text-ink-faint'>None open.</p>
      ) : (
        <ul className='space-y-1.5'>
          {armyState.promotions.map(slot => (
            <li key={slot.file} className='flex items-center justify-between gap-3'>
              <span className='font-mono text-[12px] text-ink capitalize'>
                {slot.piece.join(', ')}
              </span>
              <span className='font-notation text-[11px] text-ink-dim'>
                files {fileRange(slot.file)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Field>
  )
}
function MaterialField({ armyState, delta }: { armyState: ArmyState; delta: number }) {
  return (
    <Field label='Material'>
      <div className='flex items-baseline gap-2'>
        <span className='font-mono text-[15px] text-ink'>{armyState.material}</span>
        {delta > 0 && <span className='font-mono text-[11px] text-good'>+{delta}</span>}
      </div>
    </Field>
  )
}
export function ArmyPanel({
  player,
  position,
  side,
  active
}: {
  player: string
  position: Position
  side: Side
  active: boolean
}) {
  const armyState = army(position, side, player)
  const delta = armyState.material - material(position, side === WHITE ? BLACK : WHITE)
  return (
    <section
      className={cn(
        'overflow-hidden rounded border bg-surface transition-colors',
        active ? 'border-brass/45' : 'border-line'
      )}>
      <Player armyState={armyState} active={active} />
      <EmperorField armyState={armyState} />
      <MarshalField armyState={armyState} />
      <LostField armyState={armyState} />
      <PromotionField armyState={armyState} />
      <MaterialField armyState={armyState} delta={delta} />
    </section>
  )
}