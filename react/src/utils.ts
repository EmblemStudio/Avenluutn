export function shortAddress(address: string | null): string {
  if (!address) return ""
  return address.slice(0, 6) + "..." + address.slice(address.length - 7, address.length - 1)
}