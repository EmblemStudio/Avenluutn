import { getLootBag, getAbilityScore, getName, getClassInstance } from '../src/loot'
import { findBlockHashNear } from '../src/utils'
import { tellNarrative } from '../src/index'
import { testPrng, randomGuild, randomStartingState } from './utils'

// TODO set up secret management
const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

async function main() {
  /*
  console.log(await getLootBag(1, alchemyAPI))
  console.log(await getAbilityScore(5, alchemyAPI))
  console.log(await getName(10, alchemyAPI))
  console.log(await getClassInstance(1000, alchemyAPI))

  console.log(testPrng.next())
  console.log(testPrng.next(0, 10))
  console.log(testPrng.nextInt(10, 100000))

  console.log(await findBlockHashNear(
    Math.floor(Date.now() / 1000) - 100, // 100 seconds ago
    alchemyAPI
  ))
  */
  const testState = await randomStartingState(3, testPrng, alchemyAPI)
  console.log('created test state')
  
  console.log(await tellNarrative(
    testState,
    Math.floor(Date.now() / 1000) - 100, // 100 seconds ago
    1000,
    1,
    alchemyAPI
  ))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });