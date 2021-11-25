import Prando from 'prando'
import {
  makeProvider,
  nextBlockHash,
  randomStartingState,
  boundingBlocks,
} from './utils'
import { State, Result } from './content/interfaces'
import { Story, tellStory } from './tellStory'
import { nextState } from './nextState'
import { fetch } from 'cross-fetch'

globalThis.fetch = fetch

export interface ScriptResult {
  stories: Story[];
  nextState: State;
}

export async function tellStories(
  prevResult: ScriptResult | null,
  startTime: number,
  length: number,
  totalStories: number,
  providerUrl?: string,
): Promise<ScriptResult> {
  console.log("telling", totalStories, "stories")
  const provider = makeProvider(providerUrl)

  const startBlockHash = await nextBlockHash(startTime, provider)
  if (!startBlockHash) { throw new Error('No starting block hash') }

  const prng = new Prando(startBlockHash)

  let state: State
  if (!prevResult) {
    state = await randomStartingState(totalStories, prng, provider)
  } else {
    state = prevResult.nextState
  }
  const stories: Story[] = []
  let events: Result[] = []
  for (let i = 0; i < totalStories; i++) {
    const story = await tellStory(
      prng,
      state,
      startTime,
      length,
      i,
      provider
    )
    console.log("got story", story)
    stories.push(story)
    events = [...events, ...story.events]
  }

  const result = {
    stories,
    nextState: nextState(state, events)
  }

  return result
}

async function checkOne() {
  return tellStories(
    null,
    1637168603,
    86400,
    2,
    "http://localhost:8545",
  )
}

boundingBlocks(10, "http://localhost:8545").then(
  (blocks) => {
    if (blocks === null) {
      console.log("no bounding blocks")
    } else {
      const [lower, upper] = blocks
      console.log(upper)
      console.log(lower)
      console.log(upper.timestamp - lower.timestamp)
      console.log(upper.number - lower.number)
    }
  }
).catch(console.error)
