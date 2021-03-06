import * as fs from 'fs'

import { tellStories, ScriptResult } from '../src'

/**
 * What should be tested?
 * - find closest block function should be unit tested
 * - entire function should get some random testing
 *    - run 100 random stories
 *    - check that certain patterns are upheld, e.g. right kinds of endings
 */

// TODO set up secret management
const alchemyAPI = "https://eth-mainnet.alchemyapi.io/v2/PPujLNqHqSdJjZwxxytSUA68DA_xf8Mm"

const collections = 6
const parallelStories = 5

async function main() {
  let output = ""
  let lastState = {}
  let state = null
  let length = 1000
  let time = Math.floor(Date.now() / 1000) - length * 5
  for (let i = 0; i < collections; i++) {
    let result: ScriptResult = await tellStories(
      state,
      time,
      length,
      parallelStories,
      alchemyAPI
    )
    time += length
    state = result
    /*
    output += `STATE ${i} \r\n`
    output += JSON.stringify(result.state) + "\r\n"
    output += "\r\n"
    */
    for (let j = 0; j < parallelStories; j++) {
      output += `STORY ${i}-${j} \r\n`
      let story = result.stories[j]
      if (!story) {
        console.warn("No story")
      } else {
        story.plainText.forEach(line => {
          output += line + "\r\n"
        })
        output += `nextUpdateTime: ${story.nextUpdateTime}`
      }
      output += "\r\n"
      lastState = result.nextState
    }
  }
  fs.writeFileSync(
    `${__dirname}/output/${Date.now()}.txt`,
    output
  )
  fs.writeFileSync(
    `${__dirname}/output/lastResult.json`,
    JSON.stringify(lastState)
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });