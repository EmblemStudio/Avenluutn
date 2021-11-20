import Prando from 'prando'
import {
  makeProvider,
  nextBlockHash,
  randomStartingState,
  OutcomeText,
} from './utils'
import { State, Result } from './content/interfaces'
import { tellStory } from './tellStory'
import { nextState } from './nextState'
import { fetch } from 'cross-fetch'

globalThis.fetch = fetch

export interface ScriptResult {
  stories: Story[];
  nextState: State;
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
}

export async function tellStories(
  prevResult: ScriptResult | null,
  startTime: number,
  length: number,
  totalStories: number,
  providerUrl?: string,
): Promise<ScriptResult> {
  const provider = makeProvider(providerUrl)

  const startBlockHash = await nextBlockHash(startTime, provider)
  if (!startBlockHash) { throw new Error('No starting block hash') }

  console.log(startBlockHash)
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
    stories.push(story)
    events = [...events, ...story.events]
  }

  const result = {
    stories,
    nextState: nextState(state, events)
  }

  return result
}
