import type { Metadata } from 'next'
import { Intro } from '@/features/rules/components/Intro'
import { Notice } from '@/features/rules/components/Notice'
import { Board } from '@/features/rules/components/Board'
import { CentreSquare } from '@/features/rules/components/CentreSquare'
import { Pieces } from '@/features/rules/components/Pieces'
import { Promotion } from '@/features/rules/components/Promotion'
import { PieceValues } from '@/features/rules/components/PieceValues'
import { Result } from '@/features/rules/components/Result'

export const metadata: Metadata = {
  title: 'Rules'
}
export default function Rules() {
  return (
    <main className='mx-auto flex w-full max-w-220 flex-1 select-text flex-col gap-4 px-4 py-5 font-reading xl:px-5'>
      <Intro />
      <Notice />
      <Board />
      <CentreSquare />
      <Pieces />
      <Promotion />
      <PieceValues />
      <Result />
    </main>
  )
}