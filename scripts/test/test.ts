import { getLootBag, getAbilityScore, getName, getClassInstance } from '../src/loot'
import { closestLaterBlockHash } from '../src/utils'
import { tellNarrative } from '../src/index'
import { randomQuest } from '../src/oc/methods'
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

  const time = Math.floor(Date.now() / 1000) - 100 // 100 seconds ago

  console.log('findBlockHashNear', await findBlockHashNear(
    time,
    alchemyAPI
  ))

  console.log('closestLaterBlockHash', await closestLaterBlockHash(
    time,
    alchemyAPI
  ))
  */

  // console.log(randomQuest(testPrng))
  
  const testState = await randomStartingState(3, testPrng, alchemyAPI)
  console.log('created test state', testState)

  console.log(await tellNarrative(
    testState,
    Math.floor(Date.now() / 1000) - 100, // 100 seconds ago
    100,
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