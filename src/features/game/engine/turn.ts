import type { Move, Position, Save } from '@/types/game'
import { legality } from './legality'
import { position } from './position'
import { apply } from './apply'
import { result } from './result'

export const turn = (
  save: Save,
  move: Move | null
): { save: Save; position: Position; moves: Move[]; result: ReturnType<typeof result> } => {
  const played =
    move === null ? save : apply(position(save.side, save.occupancy, save.state), move, save.match)
  const next = position(played.side, played.occupancy, played.state)
  const moves = legality(next)
  return {
    save: played,
    position: next,
    moves,
    result: result(next, moves, played.match.history)
  }
}