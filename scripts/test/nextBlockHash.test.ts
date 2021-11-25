import { nextBlockHash, makeProvider, boundingBlocks } from '../src/utils'

/**
 * Test spec
 * - returns the same block when run many times on the same target time for recent times and old times
 * - returns null for times in the future
 * -
 */

const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

test("always gets same block hash from recent time", async () => {
  const provider = makeProvider(alchemyAPI)
  const recentTime = Math.floor(Date.now()/1000) - 100
  const hash1 = await nextBlockHash(recentTime, provider)
  const hash2 = await nextBlockHash(recentTime, provider)
  expect(hash1).toBe(hash2)
})

test("always gets same block hash from old time", async () => {

})

test("returns null for future times", async () => {

})

test.only("find correct bounding blocks", async () => {
  const provider = "http://localhost:8545"
  const cases = [
    // time, provider, [lower block number, upper block number]
    {t: 1637211738, provider, expected: [13637356, 13637356]},
    {t: 1637211739, provider, expected: [13637356, 13637357]},
    {t: 1637211737, provider, expected: [13637355, 13637356]},
    {t: 1637211737, provider, expected: [13637355, 13637356]},
    {t: -Infinity, provider, expected: null},
    {t: Infinity, provider, expected: null},
    {t: 0, provider, expected: null},
    {t: 100, provider, expected: null},
    {t: 1637211737 * 100, provider, expected: null},
  ]

  for(let i in cases) {
    const c = cases[i]
    if (c === undefined) {
      throw new Error("never, but it type narrows")
    }
    const result = await boundingBlocks(c.t, c.provider)
    if (result !== null) {
      expect(result.map(b => b?.number)).toStrictEqual(c.expected)
    } else {
      expect(result).toStrictEqual(c.expected)
    }
  }
})
