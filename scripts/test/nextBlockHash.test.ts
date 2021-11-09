import { nextBlockHash, makeProvider } from '../src/utils'

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