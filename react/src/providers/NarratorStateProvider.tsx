import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult, Label } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, storyCategory, StoryCategory, NarratorState, NetworkName, storyId, NarratorContractData, EventType, presentOrPast, storyIdFromIndices } from '../utils'
import { ADDRESSES, SERVER, CACHE_PERIOD, LOADING } from '../constants'

const emptyNarrator: Narrator = {
  NFTAddress: LOADING,
  NFTId: BigNumber.from(0),
  start: BigNumber.from(0),
  totalCollections: BigNumber.from(0),
  collectionLength: BigNumber.from(0),
  collectionSize: BigNumber.from(0),
  collectionSpacing: BigNumber.from(0),
  collections: [],
  stories: {},
  storiesByGuild: {},
  eventsByGuild: {}
}

// requireDefined asserts that the value is just the value as opposed to nothing
function requireDefined<T>(val: T, msg?: string): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      msg ?? `'val' required to be defined, but received ${val}`
    );
  }
}

export const NarratorStateContext = createContext<NarratorState>({
  narrator: emptyNarrator,
  updateNarrator: () => { },
  lastUpdate: 0,
  queryUntilUpdate: (state: NarratorState) => { },
  querying: false
})

export default ({ params, children }: { params: NarratorParams, children: ReactElement }) => {
  const [narratorState, setNarratorState] = useState<NarratorState>({
    narrator: emptyNarrator,
    updateNarrator: () => { },
    lastUpdate: 0,
    queryUntilUpdate: (state: NarratorState) => { },
    querying: false
  })

  useEffect(() => {
    updateNarratorState(narratorState, setNarratorState, params)
  }, [narratorState])

  return (
    <NarratorStateContext.Provider value={narratorState}>
      {children}
    </NarratorStateContext.Provider>
  )
}

function now() {
  return Math.floor(Date.now() / 1000)
}

let baseAuctionDuration: BigNumber = BigNumber.from(-1)

let narratorData: NarratorContractData

async function updateNarratorState(
  narratorState: NarratorState,
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams
) {
  if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
    return
  }

  await _updateNarratorState(narratorState, setNarratorState, params)
}

async function _updateNarratorState(
  narratorState: NarratorState,
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams
) {
  const address = ADDRESSES[params.network]
  requireDefined(address, "Address for ${params.netowrk} required")
  const publisher = useContractReadable(address, artifact.abi, params.network as NetworkName)
  if (!publisher) return

  if (baseAuctionDuration.eq(-1)) {
    baseAuctionDuration = await publisher.baseAuctionDuration()
  }

  if (narratorData === undefined) {
    narratorData = await publisher.narrators(params.narratorIndex)
  }

  let newNarrator: Narrator = { ...narratorData, collections: [], stories: {}, storiesByGuild: {}, eventsByGuild: {} }
  for (let i = 0; i <= Number(newNarrator.collectionSize); i++) {
    newNarrator.storiesByGuild[i] = {
      upcoming: [],
      inProgress: [],
      onAuction: [],
      completed: []
    }
  }

  const totalCollections = Number(newNarrator.totalCollections)
  const timeActive = now() - Number(newNarrator.start)
  const relevantStories = Math.floor(
    timeActive / Number(newNarrator.collectionSpacing)
  ) + 2
  const promises: Promise<void>[] = []
  for (let i = 0; i < Math.min(relevantStories, totalCollections); i++) {
    promises.push(new Promise(
      async (resolve,) => {
        let collection = await getCollection(params.narratorIndex, i)
        if (collection === null) {
          collection = {
            collectionIndex: i,
            scriptResult: {
              stories: [],
              nextState: { guilds: [] },
              nextUpdateTime: newNarrator.start.add(
                (newNarrator.collectionSpacing.mul(i))
              ).toNumber()
            }
          }
        } else {
          newNarrator.collections.push(collection)
        }
        await addStories(
          publisher,
          baseAuctionDuration,
          params.narratorIndex,
          collection,
          newNarrator
        )
        setNarratorState({
          narrator: newNarrator,
          updateNarrator: () => { updateNarratorState(narratorState, setNarratorState, params) },
          lastUpdate: Date.now(),
          queryUntilUpdate: (
            state: NarratorState,
            collectionIndex: number,
            storyIndex: number
          ) => { queryUntilStateUpdate(state, collectionIndex, storyIndex, setNarratorState, params) },
          querying
        })
        resolve()
      }
    ))
  }
  await Promise.all(promises)
}

let querying: boolean = false
let queryInterval: NodeJS.Timer

function queryUntilStateUpdate(
  narratorState: NarratorState,
  collectionIndex: number,
  storyIndex: number,
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams
) {
  console.log('starting querying for narrator state update')
  if (querying === true) {
    console.log('already querying')
    return
  }
  // _updateNarratorState(narratorState, setNarratorState, params)
  querying = true
  const currentUpdateTime = narratorState.narrator.stories[
    storyIdFromIndices(params.narratorIndex, storyIndex, collectionIndex)
  ]?.text.nextUpdateTime
  queryInterval = setInterval(async () => {
    console.log('running interval')
    const collection = await getCollection(params.narratorIndex, collectionIndex)
    const newUpdateTime = collection?.scriptResult.stories[storyIndex].nextUpdateTime
    if (newUpdateTime !== undefined && newUpdateTime > currentUpdateTime) {
      console.log('updating and stopping querying')
      _updateNarratorState(narratorState, setNarratorState, params)
      clearInterval(queryInterval)
      querying = false
    }
  }, 1000 * 10) // 10 seconds
}

async function getCollection(
  narratorIndex: number,
  collectionIndex: number
): Promise<Collection | null> {
  let response
  try {
    response = await axios.get(`${SERVER}/runs/${narratorIndex}.${collectionIndex}.json?cb=${Math.random()}`)
  } catch (err) {
    console.warn(`Bad Response: ${err}`)
    return null
  }
  if (!response.data) return null
  const scriptResult: ScriptResult = response.data
  const collection: Collection = {
    collectionIndex,
    scriptResult
  }
  return collection
}

async function addStories(
  publisher: Contract,
  auctionDuration: BigNumber,
  narratorIndex: number,
  collection: Collection,
  narrator: Narrator
) {
  const collectionIndex = collection.collectionIndex
  const newStories: Story[] = []
  for (let j = 0; j < Number(narrator.collectionSize); j++) {
    const storyIndex = j
    const contractId = await publisher.getStoryId(narratorIndex, collectionIndex, storyIndex)
    const startTime: BigNumber = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
    const endTime = startTime.add(narrator.collectionLength)
    const contractStory = await publisher.stories(contractId)
    const auction: Auction = contractStory.auction
    let text = collection.scriptResult.stories[j]
    const id = storyIdFromIndices(narratorIndex, storyIndex, collectionIndex)
    if (text === undefined) {
      console.warn("scriptResult missing story at index", j)
      text = {
        party: [],
        plainText: ["A story only the future has beheld..."],
        richText: {
          beginning: [{ string: "A story only the future has beheld...", label: Label.conjunctive }],
          middle: { obstacleText: [], outcomeText: [] },
          ending: { main: [], resultTexts: [] }
        },
        events: [],
        finalOutcome: 0,
        nextUpdateTime: startTime.toNumber()
      }
    } else {
      if (narrator.eventsByGuild[storyIndex] === undefined) narrator.eventsByGuild[storyIndex] = []
      narrator.eventsByGuild[storyIndex].push({
        type: EventType.adventureStart,
        timestamp: startTime.toNumber(),
        storyId: id
      })
      text.events.forEach(res => {
        narrator.eventsByGuild[storyIndex].push({
          type: EventType.result,
          timestamp: Math.floor(startTime.add(endTime).div(2).toNumber()), // mid-point-ish
          result: res,
          storyId: id
        })
      })
      if (presentOrPast(endTime)) {
        narrator.eventsByGuild[storyIndex].push({
          type: EventType.adventureEnd,
          timestamp: endTime.toNumber(),
          storyId: id
        })
      }
    }
    const story: Story = {
      narratorIndex,
      collectionIndex,
      storyIndex,
      startTime,
      endTime,
      auction,
      minted: contractStory.minted,
      nftId: contractStory.nftId,
      text
    }
    newStories.push(story)
    if (auction.bidder === AddressZero) {
      story.auction = Object.assign({}, auction, { duration: auctionDuration })
    }
    if (narrator.stories[id] !== undefined) console.warn("Unreachable: already loaded story")
    narrator.stories[id] = story
  }
  sortStoriesByGuild(newStories, narrator)
  for (const guildId in narrator.eventsByGuild) {
    narrator.eventsByGuild[guildId]?.sort((a, b) => a.timestamp - b.timestamp)
  }
}

function sortStoriesByGuild(stories: Story[], narrator: Narrator) {
  stories.forEach(story => {
    const category = storyCategory(narrator, story)
    switch (category) {
      case StoryCategory.upcoming:
        narrator.storiesByGuild[story.storyIndex].upcoming.push(storyId(story))
        break
      case StoryCategory.inProgress:
        narrator.storiesByGuild[story.storyIndex].inProgress.push(storyId(story))
        break
      case StoryCategory.onAuction:
        narrator.storiesByGuild[story.storyIndex].onAuction.push(storyId(story))
        break
      case StoryCategory.completed:
        narrator.storiesByGuild[story.storyIndex].completed.push(storyId(story))
        break
      default:
        console.warn("Couldn't categorize story", story)
        return
    }

    function sortStories(id1: string, id2: string) {
      const s1 = narrator.stories[id1]
      const s2 = narrator.stories[id2]
      if (s1 === undefined || s2 === undefined) return 0
      return Number(s2.startTime.sub(s1.startTime))
    }

    narrator.storiesByGuild[story.storyIndex].upcoming.sort(sortStories)
    narrator.storiesByGuild[story.storyIndex].inProgress.sort(sortStories)
    narrator.storiesByGuild[story.storyIndex].onAuction.sort(sortStories)
    narrator.storiesByGuild[story.storyIndex].completed.sort(sortStories)
  })
}
