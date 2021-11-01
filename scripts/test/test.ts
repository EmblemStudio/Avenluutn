import { getLootBag, getAbilityScore, getName, getClassInstance } from '../src/loot'
import { closestLaterBlockHash } from '../src/utils'
import { tellStories, nextState } from '../src/index'
import { randomQuest, randomObstacle, questObstacle, findOutcome } from '../src/oc/methods'
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

  /*
  const testState = await randomStartingState(3, testPrng, alchemyAPI)
  console.log('created test state', testState)
  */

  /*
  const quest = randomQuest(testPrng)
  console.log(quest)
  console.log(randomObstacle(testPrng, 1))
  console.log(randomObstacle(testPrng, 4))
  const questObs = questObstacle(testPrng, quest)
  console.log(questObs)
  const guild = testState.guilds[0]
  if (!guild) { throw new Error("no guild") }
  const outcome = await findOutcome(
    testPrng, 
    questObs, 
    Object.values(guild.adventurers),
    [],
    alchemyAPI
  )
  console.log(outcome)
  */

  const stories = await tellStories(
    null,
    1600031900,
    100,
    3,
    alchemyAPI
  )
  console.log(stories[0], stories[1], stories[2])

  // console.log('first state', stories.state.guilds[1])

  const newState = nextState(stories.state, stories.results)

  // console.log('new state', newState.guilds[1])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });