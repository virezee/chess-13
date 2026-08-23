import { IconButton } from './ui/IconButton'
import { PieceSetToggle } from './PieceSetToggle'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  return (
    <header className='sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur'>
      <div className='mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between px-5'>
        <div className='flex items-center gap-3'>
          <div className='flex items-baseline gap-2.5'>
            <span className='font-display text-[21px] leading-none text-ink'>Chess 13</span>
            <span className='hidden text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline'>
              Hotseat
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <PieceSetToggle />
          <IconButton label='Rules'>
            <span className='h-4 w-4 bg-current [mask:url(/guide.svg)_center/contain_no-repeat]' />
          </IconButton>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}