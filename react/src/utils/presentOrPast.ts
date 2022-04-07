import { BigNumber } from '@ethersproject/bignumber'

export function presentOrPast(time: BigNumber | number): boolean {
  if (typeof time !== "number") time = time.toNumber()
  return time <= Math.floor(Date.now() / 1000)
}