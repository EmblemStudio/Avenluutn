import { nextBlockHash, makeProvider, boundingBlocks } from '../src/utils'

/**
 * Test spec
 * - returns the same block when run many times on the same target time for recent times and old times
 * - returns null for times in the future
 */

//const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"
const providerURL = "http://localhost:8545" // must be forking mainnet

test("Gets consistant block hashes", async () => {
  const provider = makeProvider(providerURL)
  const cases = [
    {t: 1637211738, expected: "0xa61ba9219f1ee56d709c748586dfb9e6c7ea41f07a89070925db532d5b7aac3f" },
    {t: 1637211739, expected: "0xa61ba9219f1ee56d709c748586dfb9e6c7ea41f07a89070925db532d5b7aac3f" },
    {t: 1637211737, expected: "0x479f6ccbd4cc31116d7f0c60596d239f98e8493ac2b42db46884c24ceb5c7d95" },
    {t: -Infinity, expected: null},
    {t: Infinity, expected: null},
    {t: 0, expected: null},
    {t: 100, expected: null},
    {t: 1637211737 * 100, expected: null},
  ]

  for (let i in cases) {
    const c = cases[i]
    if (c === undefined) { throw new Error("Never, but it type narrows") }
    const result = await nextBlockHash(c.t, provider)
    expect(result).toStrictEqual(c.expected)
  }

})

test("find correct bounding blocks", async () => {
  const cases = [
    // time, provider, [lower block number, upper block number]
    {t: 1637211738, expected: [13637356, 13637356]},
    {t: 1637211739, expected: [13637356, 13637357]},
    {t: 1637211737, expected: [13637355, 13637356]},
    {t: -Infinity, expected: null},
    {t: Infinity, expected: null},
    {t: 0, expected: null},
    {t: 100, expected: null},
    {t: 1637211737 * 100, expected: null},
  ]

  for(let i in cases) {
    const c = cases[i]
    if (c === undefined) { throw new Error("never, but it type narrows") }
    const result = await boundingBlocks(c.t, providerURL)
    if (result !== null) {
      expect(result.map(b => b?.number)).toStrictEqual(c.expected)
    } else {
      expect(result).toStrictEqual(c.expected)
    }
  }
})
