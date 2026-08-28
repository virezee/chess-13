import type { Move, Save, Position } from '@/types/game'
import { opening } from '@/features/game/engine/turn'
import { clearSave } from '@/features/game/lib/save'

export const takeResign = (
  save: Save,
  setSave: (save: Save) => void,
  setPromotions: (moves: Move[]) => void,
  position: Position
): void => {
  setSave({ ...save, match: { ...save.match, resigned: position.side } })
  setPromotions([])
  clearSave()
}
export const takeNewGame = (
  setSave: (save: Save) => void,
  setPromotions: (moves: Move[]) => void,
  setKey: (next: (round: number) => number) => void
): void => {
  setSave(opening())
  setPromotions([])
  setKey(round => round + 1)
  clearSave()
}