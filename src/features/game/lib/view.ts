import { Piece, Position } from '@/types/piece'
import { View } from '@/types/move'

export const occupantAt = (position: Position, view: View, square: string): Piece | undefined => {
  if (view.moved && view.moved.square === square) return view.moved.piece
  if (view.vacated?.includes(square)) return
  return position[square]
}