import { BaseProvider } from '@ethersproject/providers' 

export function wrongNetwork(provider: BaseProvider, network: string): boolean {
  return provider.network.name !== network
}