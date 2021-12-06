export function noConnection(wallet: any): boolean {
  return !wallet.ethereum
}