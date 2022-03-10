import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult, Label } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, storyCategory, StoryCategory, NarratorState, presentOrPast, NetworkName, storyId, NarratorContractData } from '../utils'
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
  storiesByGuild: {}
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

  let newNarrator: Narrator = { ...narratorData, collections: [], stories: {}, storiesByGuild: {} }
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
          queryUntilUpdate: (state: NarratorState) => { queryUntilStateUpdate(state, setNarratorState, params) },
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
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams
) {
  console.log('Starting querying for narrator state update')
  if (querying === true) {
    return
  }
  console.log('proceeding with querying')
  _updateNarratorState(narratorState, setNarratorState, params)
  const lastCollectionIndex = narratorState.narrator.collections.length - 1
  const collection = narratorState.narrator.collections[lastCollectionIndex]
  console.log('querying collection', collection, narratorState.narrator.collections)
  if (collection === undefined) return
  querying = true
  const nextUpdateTime = collection.scriptResult.nextUpdateTime
  queryInterval = setInterval(() => {
    console.log('querying ...')
    const newCollection = narratorState.narrator.collections[lastCollectionIndex]
    if (newCollection === undefined) return
    // console.log('query update times', newCollection.scriptResult.nextUpdateTime, nextUpdateTime)
    console.log(newCollection.scriptResult.stories[0]?.plainText.length, collection.scriptResult.stories[0]?.plainText.length, nextUpdateTime)
    if (
      newCollection.scriptResult.stories[0]?.plainText.length > collection.scriptResult.stories[0]?.plainText.length ||
      nextUpdateTime === -1
    ) {
      // we got an update--stop querying
      console.log('stopping querying')
      clearInterval(queryInterval)
      return
    }
    _updateNarratorState(narratorState, setNarratorState, params)
  }, 1000 * 20) // retry every 20 seconds
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
    const startTime = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
    const endTime = startTime.add(narrator.collectionLength)
    const contractStory = await publisher.stories(contractId)
    const auction: Auction = contractStory.auction
    let text = collection.scriptResult.stories[j]
    if (text === undefined) {
      console.warn("scriptResult missing story at index", j)
      text = {
        id: [-1, -1],
        plainText: ["A story only the future has beheld..."],
        richText: {
          beginning: [{ string: "A story only the future has beheld...", label: Label.conjunctive }],
          middle: { obstacleText: [], outcomeText: [] },
          ending: { main: [], resultTexts: [] }
        },
        events: [],
        finalOutcome: 0,
        nextUpdateTime: startTime
      }
      // continue
    }
    const id = storyId(collectionIndex, storyIndex)
    const story: Story = {
      narratorIndex,
      collectionIndex,
      storyIndex,
      id,
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
}

async function sortStoriesByGuild(stories: Story[], narrator: Narrator) {
  stories.forEach(story => {
    const category = storyCategory(narrator, story)
    switch (category) {
      case StoryCategory.upcoming:
        narrator.storiesByGuild[story.storyIndex].upcoming.push(story.id)
        break
      case StoryCategory.inProgress:
        narrator.storiesByGuild[story.storyIndex].inProgress.push(story.id)
        break
      case StoryCategory.onAuction:
        narrator.storiesByGuild[story.storyIndex].onAuction.push(story.id)
        break
      case StoryCategory.completed:
        narrator.storiesByGuild[story.storyIndex].completed.push(story.id)
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
