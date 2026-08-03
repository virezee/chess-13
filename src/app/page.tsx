import { Board } from '@/features/game/components/Board'
import { ArmyPanel } from '@/features/game/components/ArmyPanel'
import { MoveLog } from '@/features/game/components/MoveLog'
import { GameStatus } from '@/features/game/components/GameStatus'
import {
  blackArmy,
  counters,
  moveLog,
  position,
  swapAvailable,
  turnToMove,
  whiteArmy
} from '@/features/game/mock'

export default function Home() {
  const materialGap = whiteArmy.material - blackArmy.material
  return (
    <main className='mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-[18.5rem_minmax(0,1fr)_20rem] xl:gap-5 xl:px-5 xl:py-5'>
      <aside className='order-2 flex flex-col gap-4 lg:order-2 xl:order-1'>
        <ArmyPanel army={blackArmy} active={turnToMove === 'black'} delta={-materialGap} />
        <ArmyPanel army={whiteArmy} active={turnToMove === 'white'} delta={materialGap} />
      </aside>
      <div className='order-1 flex justify-center lg:col-span-2 xl:order-2 xl:col-span-1'>
        <Board position={position} />
      </div>
      <aside className='order-3 flex flex-col gap-4'>
        <MoveLog turns={moveLog} toMove={turnToMove} />
        <GameStatus counters={counters} swapAvailable={swapAvailable} />
      </aside>
    </main>
  )
}