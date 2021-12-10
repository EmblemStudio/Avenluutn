// import Prando from 'prando'
import {
  makeProvider,
  randomStartingState,
  newCheckpoint,
  checkPointErrors,
  ScriptResult,
  Story,
  State, 
  Result
} from './utils'
import { tellStory } from './tellStory'
import { nextState } from './nextState'
import { fetch } from 'cross-fetch'
import Prando from 'prando';

globalThis.fetch = fetch

export * from './utils/interfaces'

export async function tellStories(
  prevResult: ScriptResult | null,
  startTime: number,
  length: number,
  totalStories: number,
  providerUrl?: string,
): Promise<ScriptResult> {
  const provider = makeProvider(providerUrl)
  const checkpoint = await newCheckpoint(startTime, provider)

  if (checkpoint.error) {
    if (checkpoint.error.message === checkPointErrors.timeInFuture) {
      return {
        stories: [],
        nextState: prevResult ? prevResult.nextState : { guilds: [] },
        nextUpdateTime: startTime
      }
    }
    return {
      stories: [],
      nextState: prevResult ? prevResult.nextState : { guilds: [] },
      nextUpdateTime: -1
    }
  }

  let state: State
  if (!prevResult) {
    state = await randomStartingState(totalStories, checkpoint.prng, provider)
  } else {
    state = prevResult.nextState
  }
  const stories: Story[] = []
  let events: Result[] = []
  let nextUpdateTime = -1
  for (let i = 0; i < totalStories; i++) {
    const story = await tellStory(
      new Prando(checkpoint.blockHash + `${i}`),
      state,
      startTime,
      length,
      i,
      provider
    )
    if (nextUpdateTime === -1 || nextUpdateTime > story.nextUpdateTime) { 
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

