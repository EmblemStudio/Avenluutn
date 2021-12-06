import { COLORS } from '../constants'

export function coloredBoldStyle(color: string | null) {
  if (!color) return ""
  if (COLORS.indexOf(color) === -1) throw new Error("Invalid color")
  return ` has-text-${color} has-text-weight-bold`
}