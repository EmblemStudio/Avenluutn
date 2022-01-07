import { BaseProvider } from '@ethersproject/providers'

export function noConnection(provider: BaseProvider): boolean {
  return provider.anyNetwork === false
}