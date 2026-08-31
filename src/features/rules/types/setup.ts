import type { Piece } from '@/types/material'

export interface BoardPiece extends Piece {
  square: string
  isEnhanced: boolean
}
export interface DiagramMarks {
  squares: string[]
  background: string
  clip?: string
}