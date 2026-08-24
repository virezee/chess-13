import type { Side } from '@/types/material'
import { BLACK } from '@/constants/player'
import { CLASSIC_PLY } from '@/constants/piece'
import { NATIVE } from '@/constants/display'
import { fullMoves } from '../../engine/notation'
import { useMode } from '@/lib/mode'
import { cn } from '@/lib/cn'

function Ply({
  move,
  pending,
  latest
}: {
  move: string | null
  pending: boolean
  latest: boolean
}) {
  if (move === null)
    return (
      <span
        className={cn(
          'rounded-xs px-1.5 py-1 font-notation font-bold text-[12px]',
          pending ? 'text-ink-faint' : 'text-transparent'
        )}>
        {pending ? '…' : '-'}
      </span>
    )
  return (
    <span
      className={cn(
        'rounded-xs px-1.5 py-1 font-notation font-bold text-[12px]',
        latest ? 'bg-brass/12 text-brass' : 'text-ink-dim'
      )}>
      {move}
    </span>
  )
}
export function MoveList({ pgn, toMove }: { pgn: string; toMove: Side }) {
  const moves = fullMoves(pgn)
  const lastIndex = moves.length - 1
  const isNative = useMode() === NATIVE
  const letters = (ply: string | null): string | null =>
    ply === null || isNative
      ? ply
      : ply.replaceAll(/[A-Z]/gu, letter => CLASSIC_PLY[letter] ?? letter)
  return (
    <section className='flex min-h-0 flex-col overflow-hidden rounded border border-line bg-surface'>
      <header className='flex items-baseline justify-between border-b border-line px-3.5 py-3'>
        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint'>
          Move Log
        </p>
        <span className='font-mono text-[11px] text-ink-faint'>{moves.length} turns</span>
      </header>
      <div className='scroll-thin max-h-76 min-h-0 flex-1 overflow-y-auto px-2 py-2'>
        <ol>
          {moves.map((move, i) => {
            const isLast = i === lastIndex
            return (
              <li
                key={move.number}
                className='grid grid-cols-[2rem_1fr_1fr] items-center gap-1 rounded-xs px-1 py-0.5 hover:bg-surface-2'>
                <span className='font-mono text-[11px] text-ink-faint'>{move.number}</span>
                <Ply
                  move={letters(move.white)}
                  pending={false}
                  latest={isLast && move.black === null}
                />
                <Ply
                  move={letters(move.black)}
                  pending={isLast && toMove === BLACK}
                  latest={isLast && move.black !== null}
                />
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}