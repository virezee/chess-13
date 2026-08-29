import { SIZE, FILES, RANKS } from '@/constants/board'
import { WHITE } from '@/constants/player'
import { MARSHAL } from '@/constants/piece'
import { herald, sentinel, templar, legionary } from '@/features/game/engine/moves'

const alongFile = (count: number): string[] => RANKS.slice(1, count + 1).map(rank => `a${rank}`)
const alongRank = (count: number): string[] => FILES.slice(1, count + 1).map(file => `${file}1`)

export const heraldReach = (isEnhanced: boolean): string[] =>
  herald(WHITE, {}, 'c3', isEnhanced).map(move => move.to)
export const heraldDiagonals = (isEnhanced: boolean): string[] =>
  heraldReach(isEnhanced).filter(square => !new Set(['b3', 'c2', 'c4', 'd3']).has(square))
export const sentinelReach = (isEnhanced: boolean): string[] =>
  sentinel(
    WHITE,
    isEnhanced ? { d1: { side: WHITE, piece: MARSHAL } } : {},
    'a1',
    'd1',
    isEnhanced
  ).map(move => move.to)
export const sentinelCapture = (isEnhanced: boolean): string[] =>
  isEnhanced ? [...alongFile(SIZE - 1), ...alongRank(2)] : [...alongFile(6), ...alongRank(6)]
export const templarLeap = (isEnhanced: boolean): string[] =>
  templar(WHITE, {}, 'g7', isEnhanced).map(move => move.to)
export const legionaryAdvance = (isEnhanced: boolean): string[] =>
  legionary(WHITE, {}, 'e3', isEnhanced, [], null).map(move => move.to)
export const legionaryStep = (isEnhanced: boolean): string[] =>
  legionary(WHITE, {}, 'e8', isEnhanced, [], null).map(move => move.to)