import type { Piece } from '@/types/material'

export interface BoardPiece extends Piece {
  square: string
  isEnhanced: boolean
}