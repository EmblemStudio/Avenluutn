export function wrongNetwork(wallet: any, network: string): boolean {
  return wallet.networkName !== network
}