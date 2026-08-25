import type { SquareOccupant } from '@/types/material'
import type { Move, View } from '@/types/game'
import Image from 'next/image'
import { NATIVE, CLASSIC_IMAGE } from '@/constants/display'
import { SQUARE, BUFF } from '@/constants/style'
import { origin, translate } from '../../lib/layout'
import { useMode } from '@/lib/mode'
import { cn } from '@/lib/cn'

function PieceImage({
  piece,
  square,
  isNative,
  isBuffed,
  isFlipped,
  isAnimated,
  isFallen
}: Required<View>['moved'] & {
  isNative: boolean
  isBuffed: boolean
  isFlipped: boolean
  isAnimated: boolean
  isFallen: boolean
}) {
  const classic = CLASSIC_IMAGE[piece.piece]
  const file = isNative || classic === undefined ? `${piece.piece}.png` : classic
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
        key={`${piece.side}/${file}`}
        src={`/${piece.side}/${file}`}
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
  isAnimated,
  fallen
}: {
  occupancy: SquareOccupant
  ids: Map<string, number>
  snap: Move | null
  enhanced: Set<string>
  isFlipped: boolean
  isAnimated: boolean
  fallen: string | null
}) {
  const isNative = useMode() === NATIVE
  return Object.entries(occupancy)
    .toSorted(([a], [b]) => (ids.get(a) ?? 0) - (ids.get(b) ?? 0))
    .map(([square, piece]) => (
      <PieceImage
        key={ids.get(square)}
        piece={piece}
        square={origin(snap, square)}
        isNative={isNative}
        isBuffed={enhanced.has(square)}
        isFlipped={isFlipped}
        isAnimated={isAnimated}
        isFallen={square === fallen}
      />
    ))
}