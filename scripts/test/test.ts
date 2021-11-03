import { tellStories, nextState } from '../src'

/**
 * What should be tested?
 * - find closest block function should be unit tested
 * - entire function should get some random testing
 *    - run 100 random stories
 *    - check that certain patterns are upheld, e.g. right kinds of endings
 */

// TODO set up secret management
const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

async function main() {
  const stories = await tellStories(
    null,
    1600031900,
    100,
    3,
    alchemyAPI
  )
  console.log(stories[0], stories[1], stories[2])

  // console.log('first state', stories.state.guilds[1])

  const newState = nextState(stories.state, stories.events)

  // console.log('new state', newState.guilds[1])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });