import type { Step } from '@/types/game'
import Image from 'next/image'

export function Counterpart({ from, to }: Step) {
  return (
    <div className='mt-4 flex select-none items-center justify-center gap-5'>
      <Image src={`/white/${from}.svg`} alt={from} width={72} height={72} />
      <span className='text-[26px] leading-none text-ink-faint'>&rarr;</span>
      <Image src={`/white/${to}.png`} alt={to} width={72} height={72} />
    </div>
  )
}