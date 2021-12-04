import { COLORS, DEFAULT_COLOR } from '../constants'

export function guildColor(id: number): string {
  return COLORS[id % (COLORS.length - 1)] ?? DEFAULT_COLOR
}
