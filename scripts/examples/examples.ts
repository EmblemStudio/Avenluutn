import * as fs from 'fs'

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

const collections = 10
const parallelStories = 5

async function main() {
  let output = ""
  let state = null
  let time = 1600031000
  for(let i = 0; i < collections; i++) {
    console.log("Making stories", i)
    let stories = await tellStories(
      state,
      time,
      100,
      parallelStories,
      alchemyAPI
    )
    console.log(stories)
    state = nextState(stories.state, stories.events)
    time += 1000
    /*
    if (i === 0) {
      output += "STARTING STATE \r\n"
      output += JSON.stringify(stories.state) + "\r\n"
    } else {
      output += `STATE ${i} \r\n`
      output += JSON.stringify(state) + "\r\n"
    }
    output += "\r\n"
    */
    for(let j = 0; j < parallelStories; j++) {
      const story = stories[j]
      if (!story) throw new Error("No story")
      output += `STORY ${i}-${j} \r\n`
      story.plainText.forEach(line => {
        output += line + "\r\n"
      })
      output += "\r\n"
    }
  }
  fs.writeFileSync(
    `${__dirname}/output/${Date.now()}.txt`,
    output
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });