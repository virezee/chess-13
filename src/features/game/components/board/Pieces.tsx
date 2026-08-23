import type { SquareOccupant } from '@/types/material'
import type { Move, View } from '@/types/game'
import Image from 'next/image'
import { SQUARE, BUFF } from '@/constants/style'
import { origin, translate } from '../../lib/view'
import { cn } from '@/lib/cn'

function PieceImage({
  piece,
  square,
  isBuffed,
  isFlipped,
  isAnimated,
  isFallen
}: Required<View>['moved'] & {
  isBuffed: boolean
  isFlipped: boolean
  isAnimated: boolean
  isFallen: boolean
}) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0 cursor-pointer',
        isAnimated && 'transition-transform duration-200 ease-out'
      )}
      style={{ ...translate(square, isFlipped), willChange: 'transform', zIndex: 1 }}>
      {isBuffed && (
        <span
          className='pointer-events-none absolute inset-0'
          style={{
            background: BUFF[piece.side],
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'
          }}
        />
      )}
      <Image
        key={`${piece.side}/${piece.piece}`}
        src={`/${piece.side}/${piece.piece}.png`}
        alt={`${piece.side} ${piece.piece}`}
        fill
        sizes={SQUARE}
        loading='eager'
        draggable={false}
        className={cn('select-none object-contain', isFallen && 'checkmate-fall')}
      />
    </div>
  )
}
export function Pieces({
  occupancy,
  ids,
  snap,
  enhanced,
  isFlipped,
  fallen
}: {
  occupancy: SquareOccupant
  ids: Map<string, number>
  snap: Move | null
  enhanced: Set<string>
  isFlipped: boolean
  fallen: string | null
}) {
  return Object.entries(occupancy)
    .toSorted(([a], [b]) => (ids.get(a) ?? 0) - (ids.get(b) ?? 0))
    .map(([square, piece]) => (
      <PieceImage
        key={ids.get(square)}
        piece={piece}
        square={origin(snap, square)}
        isBuffed={enhanced.has(square)}
        isFlipped={isFlipped}
        isAnimated={snap === null}
        isFallen={square === fallen}
      />
    ))
}