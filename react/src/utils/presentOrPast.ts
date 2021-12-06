import { BigNumber } from '@ethersproject/bignumber'

export function presentOrPast(bigNumTime: BigNumber): boolean {
  return Number(bigNumTime) <= Math.floor(Date.now()/1000)
}