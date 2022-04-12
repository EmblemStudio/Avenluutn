// import Prando from 'prando'
import {
  makeProvider,
  // randomStartingState, // use this if starting fresh
  newCheckpoint,
  ScriptResult,
  Story,
  State,
  Result
} from './utils'
import { tellStory } from './tellStory'
import { nextState } from './nextState'
import { fetch } from 'cross-fetch'
import Prando from 'prando';
import { startingState } from './startingState'; // use this if starting from a previous state

// does this break anything? it was throwing errors in browser
if (typeof window === 'undefined') globalThis.fetch = fetch

export * from './utils/interfaces'

export async function tellStories(
  prevResult: ScriptResult | null,
  startTime: number,
  length: number,
  totalStories: number,
  providerUrl?: string,
): Promise<ScriptResult> {
  const provider = makeProvider(providerUrl)
  const runStart = Math.floor(Date.now() / 1000)
  const checkpoint = await newCheckpoint(runStart, startTime, provider)
  let nextUpdateTime = startTime

  if (checkpoint.error) {
    return {
      stories: [],
      nextState: prevResult ? prevResult.nextState : { guilds: [] },
      nextUpdateTime: startTime
    }
  }

  let state: State
  if (!prevResult) {
    state = startingState // use this if starting from a previous state
    // state = await randomStartingState(totalStories, checkpoint.prng, provider) // use this if starting fresh
  } else {
    state = prevResult.nextState
  }
  const stories: Story[] = []
  let events: Result[] = []
  for (let i = 0; i < totalStories; i++) {
    const story = await tellStory(
      runStart,
      new Prando(checkpoint.blockHash + `${i}`),
      state,
      startTime,
      length,
      i,
      provider
    )
    // if nextUpdateTime hasn't been updated yet OR this time is earlier
    if (nextUpdateTime === startTime || nextUpdateTime > story.nextUpdateTime) {
      nextUpdateTime = story.nextUpdateTime
    }

    stories.push(story)
    events = [...events, ...story.events]
  }

  const result = {
    stories,
    nextState: nextState(state, events),
    nextUpdateTime
  }

  return result
}

