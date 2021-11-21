const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]

export function guildColor(id: number): string {
  return COLORS[id % (COLORS.length - 1)]
}