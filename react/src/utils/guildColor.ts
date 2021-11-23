import { COLORS } from '../constants' 

export function guildColor(id: number): string {
  return COLORS[id % (COLORS.length - 1)]
}