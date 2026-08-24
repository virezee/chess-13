import { SIZE } from '@/constants/board'
import { arrowPoints } from '../../lib/view'

export function Arrows({
  arrows,
  isFlipped
}: {
  arrows: Record<string, string>
  isFlipped: boolean
}) {
  const drawn = Object.entries(arrows)
  if (drawn.length === 0) return null
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className='pointer-events-none absolute inset-0'
      style={{ zIndex: 2 }}
      aria-hidden>
      {drawn.map(([step, colour]) => {
        const [from, to] = step.split('-')
        return (
          <polygon
            key={step}
            points={arrowPoints({ from: from!, to: to! }, isFlipped)}
            fill={colour}
          />
        )
      })}
    </svg>
  )
}