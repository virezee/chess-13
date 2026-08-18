import type { Counter, Position } from '@/types/game'
import { REPETITION_LIMIT } from '@/constants/outcome'
import { repetitionKey, repetitionCount } from '../engine/outcome'
import { cn } from '@/lib/cn'

function RepetitionGauge({ count, limit }: Counter) {
  const nearLimit = count >= limit - 1
  return (
    <div className='border-t border-line px-3.5 py-3'>
      <div className='flex items-baseline justify-between gap-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Repetition
        </p>
        <span className={cn('font-mono text-[11px]', nearLimit ? 'text-alert' : 'text-ink-dim')}>
          {count}/{limit}
        </span>
      </div>
      <div className='mt-2 flex gap-1'>
        {Array.from({ length: limit }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-[1px]',
              i >= count && 'bg-track',
              i < count && !nearLimit && 'bg-ink-faint',
              i < count && nearLimit && 'bg-alert'
            )}
          />
        ))}
      </div>
      <p className={cn('mt-2 text-[11px]', nearLimit ? 'text-alert' : 'text-ink-faint')}>
        {nearLimit ? 'One more repetition loses the game' : 'Third repetition loses the game'}
      </p>
    </div>
  )
}
function NoProgressGauge({ count, limit }: Counter) {
  const ratio = limit === 0 ? 0 : Math.min(count / limit, 1)
  const nearLimit = ratio >= 0.8
  return (
    <div className='border-t border-line px-3.5 py-3'>
      <div className='flex items-baseline justify-between gap-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          No Progress
        </p>
        <span className={cn('font-mono text-[11px]', nearLimit ? 'text-alert' : 'text-ink-dim')}>
          {count}/{limit}
        </span>
      </div>
      <div className='mt-2 h-1 w-full overflow-hidden rounded-[1px] bg-track'>
        <div
          className={cn(
            'h-full transition-[width] duration-300',
            nearLimit ? 'bg-alert' : 'bg-ink-faint'
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
    </div>
  )
}
function Action({
  children,
  tone = 'quiet',
  onClick
}: {
  children: React.ReactNode
  tone?: 'quiet' | 'accept' | 'decline'
  onClick?: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'h-9 flex-1 rounded-[3px] border text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
        tone === 'quiet' &&
          'border-line bg-surface-2 text-ink-dim hover:border-line-strong hover:text-ink',
        tone === 'accept' && 'border-good/60 bg-good/10 text-good hover:bg-good/20',
        tone === 'decline' && 'border-alert/60 bg-alert/10 text-alert hover:bg-alert/20'
      )}>
      {children}
    </button>
  )
}
function SwapPrompt({ onDecline, onAccept }: { onDecline: () => void; onAccept: () => void }) {
  return (
    <div className='border-t border-line px-3.5 py-3'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
        Swap sides?
      </p>
      <div className='mt-2 flex gap-2'>
        <Action tone='decline' onClick={onDecline}>
          <span className='text-[15px] leading-none tracking-normal'>✕</span>
        </Action>
        <Action tone='accept' onClick={onAccept}>
          <span className='text-[15px] leading-none tracking-normal'>✓</span>
        </Action>
      </div>
    </div>
  )
}
export function GameStatus({
  position,
  history,
  canSwap,
  onDecline,
  onAccept,
  onNewGame
}: {
  position: Position
  history: readonly string[]
  canSwap: boolean
  onDecline: () => void
  onAccept: () => void
  onNewGame?: () => void
}) {
  const { noProgress } = position.state
  const repetition = repetitionCount(
    repetitionKey(position.side, position.occupancy, position.state),
    history
  )
  return (
    <section className='overflow-hidden rounded border border-line bg-surface'>
      <header className='px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Clocks Off · Counters
        </p>
      </header>
      <RepetitionGauge count={repetition} limit={REPETITION_LIMIT} />
      <NoProgressGauge count={noProgress.count} limit={noProgress.limit} />
      {canSwap && <SwapPrompt onDecline={onDecline} onAccept={onAccept} />}
      <div className='border-t border-line px-3.5 py-3'>
        <div className='flex gap-2'>
          <Action>Resign</Action>
          <Action onClick={onNewGame}>New game</Action>
        </div>
      </div>
    </section>
  )
}