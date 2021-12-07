// import Prando from 'prando'
import {
  makeProvider,
  // nextBlockHash,
  randomStartingState,
  OutcomeText,
  newCheckpoint,
  checkPointErrors
} from './utils'
import { State, Result } from './content/interfaces'
import { tellStory } from './tellStory'
import { nextState } from './nextState'
import { fetch } from 'cross-fetch'

globalThis.fetch = fetch

export * from './content/interfaces'

export interface ScriptResult {
  stories: Story[];
  nextState: State;
  nextUpdateTime: number;
}

export interface Story {
  plainText: string[];
  richText: {
    beginning: string[];
    middle: {
      obstacleText: string[];
      outcomeText: OutcomeText[];
    };
    ending: string[];
  }
  events: Result[];
  nextUpdateTime: number;
}

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
      checkpoint.prng,
      state,
      startTime,
      length,
      i,
      provider
    )
    if (nextUpdateTime === -1 || nextUpdateTime > story.nextUpdateTime) { 
      nextUpdateTime = story.nextUpdateTime
    }
    console.log(`ran story guild ${i}. Current next update time: ${nextUpdateTime}`)
    // console.log("got story", story)
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

