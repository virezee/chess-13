import { cn } from '@/lib/cn'
import { FILES } from '@/constants/board'
import type { ArmyState, AuraState } from '@/types/panel'

const AURA_COPY: Record<AuraState, { label: string; note: string }> = {
  full: { label: 'Command square', note: 'Whole army enhanced' },
  partial: { label: 'Aura active', note: 'Chebyshev 4' },
  none: { label: 'Marshal down', note: 'Whole army restricted' }
}

/**
 * A slot is claimable on the file its piece fell on and one file to either side,
 * so the range is worked out here rather than stored twice.
 */
function claimableFiles(file: number) {
  const first = Math.max(0, file - 1)
  const last = Math.min(FILES.length - 1, file + 1)
  return `${FILES[first]}-${FILES[last]}`
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

function AuraMeter({ army }: { army: ArmyState }) {
  const copy = AURA_COPY[army.aura]
  const ratio = army.pieceCount === 0 ? 0 : army.enhancedCount / army.pieceCount

  return (
    <div
      className={cn(
        'rounded-[3px] border px-3 py-2.5',
        army.aura === 'full' && 'border-brass-deep bg-brass/8',
        army.aura === 'partial' && 'border-line-strong bg-surface-2',
        army.aura === 'none' && 'border-alert/40 bg-alert/8'
      )}>
      <div className='flex items-baseline justify-between gap-3'>
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.12em]',
            army.aura === 'down' ? 'text-alert' : 'text-brass'
          )}>
          {copy.label}
        </span>
        <span className='font-mono text-[11px] text-ink-dim'>
          {army.strongCount}
          <span className='text-ink-faint'>/{army.pieceCount}</span>
        </span>
      </div>

      <div className='mt-2 h-1 w-full overflow-hidden rounded-[1px] bg-track'>
        <div
          className={cn(
            'h-full transition-[width] duration-300',
            army.aura === 'down' ? 'bg-alert/60' : 'bg-brass'
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>

      <p className='mt-2 text-[11px] text-ink-faint'>{copy.note}</p>
    </div>
  )
}
export function ArmyPanel({
  army,
  active,
  delta
}: {
  army: ArmyState
  active: boolean
  /** Material lead over the opponent. Only rendered when positive. */
  delta: number
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded border bg-surface transition-colors',
        active ? 'border-brass/45' : 'border-line'
      )}>
      <header className='flex items-center justify-between gap-3 px-3.5 py-3'>
        <div className='flex items-center gap-2.5'>
          <span
            aria-hidden
            className={cn(
              // Both dots carry a ring. Without it the white dot vanishes on a
              // light surface and the black dot vanishes on a dark one.
              'h-2.5 w-2.5 rounded-full border border-line-strong',
              army.side === 'white' ? 'bg-army-white' : 'bg-army-black'
            )}
          />
          <div className='leading-tight'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-ink'>
              {army.side}
            </p>
            <p className='text-[11px] text-ink-faint'>{army.player}</p>
          </div>
        </div>

        {active && (
          <span className='rounded-xs border border-brass-deep bg-brass/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-brass'>
            To move
          </span>
        )}
      </header>

      <Field
        label='Marshal'
        trailing={
          <span className='font-mono text-[12px] text-ink'>{army.marshalSquare ?? '--'}</span>
        }>
        <AuraMeter army={army} />
      </Field>

      <Field
        label='Emperor'
        trailing={
          <span className='font-mono text-[12px] text-ink'>{army.emperor?.square ?? '--'}</span>
        }>
        {army.emperor === null ? (
          <p className='text-[12px] text-ink-faint'>Captured</p>
        ) : (
          <div
            className={cn(
              'rounded-[3px] border px-3 py-2.5',
              army.emperor.awake ? 'border-line-strong bg-surface-2' : 'border-line bg-surface-2'
            )}>
            <span
              className={cn(
                'text-[11px] font-semibold uppercase tracking-[0.12em]',
                army.emperor.awake ? 'text-brass' : 'text-ink-faint'
              )}>
              {army.emperor.awake ? 'Awake' : 'Dormant'}
            </span>
          </div>
        )}
      </Field>

      <Field
        label='Lost'
        trailing={<span className='font-mono text-[11px] text-ink-faint'>{army.lost.length}</span>}>
        {army.lost.length === 0 ? (
          <p className='text-[12px] text-ink-faint'>Nothing yet</p>
        ) : (
          <div className='flex flex-wrap gap-1'>
            {army.lost.map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className='grid h-6 w-6 place-items-center rounded-xs border border-line-strong bg-surface-2 font-notation font-bold text-[11px] text-ink-dim'>
                {letter}
              </span>
            ))}
          </div>
        )}
      </Field>

      <Field label='Promotion slots'>
        {army.promotionSlots.length === 0 ? (
          <p className='text-[12px] text-ink-faint'>None open</p>
        ) : (
          <ul className='space-y-1.5'>
            {army.promotionSlots.map((slot) => (
              <li key={slot.piece} className='flex items-center justify-between gap-3'>
                <span className='font-mono text-[12px] text-ink capitalize'>{slot.piece}</span>
                <span className='font-notation text-[11px] text-ink-dim'>
                  files {claimableFiles(slot.file)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Field>

      <Field label='Material'>
        <div className='flex items-baseline gap-2'>
          <span className='font-mono text-[15px] text-ink'>{army.material.toFixed(1)}</span>
          {delta > 0 && (
            <span className='font-mono text-[11px] text-good'>+{delta.toFixed(1)}</span>
          )}
        </div>
      </Field>
    </section>
  )
}