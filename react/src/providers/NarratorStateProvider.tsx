import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult, Label } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, StoriesByGuild, NarratorState, presentOrPast, NetworkName } from '../utils'
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
  stories: {}
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

// TODO figure out what type narratorData is and update it from any
let narratorData: any = undefined

async function updateNarratorState(
  narratorState: NarratorState,
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams
) {
  if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
    console.warn('Cache warm, stopping updateNarratorState')
    return
  }

  _updateNarratorState(narratorState, setNarratorState, params)
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

  let newNarrator: Narrator = { ...narratorData, collections: [], stories: {} }
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
        newNarrator.stories = await concatCategorizedStories(
          publisher,
          baseAuctionDuration,
          params.narratorIndex,
          Number(newNarrator.collectionSize),
          newNarrator.collectionLength,
          collection,
          newNarrator.stories,
          collection.scriptResult
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
    if (newCollection.scriptResult.nextUpdateTime !== nextUpdateTime) {
      // we got an update--stop querying
      console.log('stopping querying')
      clearInterval(queryInterval)
      return
    }
    _updateNarratorState(narratorState, setNarratorState, params)
  }, 1000 * 20) // retry every 20 seconds
}

function sortStories(s1: Story, s2: Story) { return Number(s2.startTime.sub(s1.startTime)) }

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
  console.log("got collection", narratorIndex, collectionIndex, scriptResult)
  const collection: Collection = {
    collectionIndex,
    scriptResult
  }
  return collection
}

async function concatCategorizedStories(
  publisher: Contract,
  auctionDuration: BigNumber,
  narratorIndex: number,
  collectionSize: number,
  collectionLength: BigNumber,
  collection: Collection,
  storiesSoFar: StoriesByGuild,
  scriptResult: ScriptResult,
): Promise<StoriesByGuild> {
  const collectionIndex = collection.collectionIndex
  for (let j = 0; j < collectionSize; j++) {
    const storyIndex = j
    const id = await publisher.getStoryId(narratorIndex, collectionIndex, storyIndex)
    const startTime = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
    const endTime = startTime.add(collectionLength)
    const contractStory = await publisher.stories(id)
    const auction: Auction = contractStory.auction
    let text = scriptResult.stories[j]
    if (text === undefined) {
      console.warn("scriptResult missing story at index", j)
      text = {
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
    if (auction.bidder === AddressZero) {
      story.auction = Object.assign({}, auction, { duration: auctionDuration })
    }
    const started = presentOrPast(story.startTime)
    // TODO the server will not have the finished story right at this time, so we need to show something about it still getting it
    const storyEnded = presentOrPast(story.endTime)
    const auctionEnded = presentOrPast(story.endTime.add(story.auction.duration))
    console.log(story.id, started, storyEnded, auctionEnded)
    if (!storiesSoFar[storyIndex]) {
      storiesSoFar[storyIndex] = {
        upcoming: [],
        inProgress: [],
        onAuction: [],
        completed: []
      }
    }
    if (!started) {
      storiesSoFar[storyIndex].upcoming.push(story)
    } else if (started && !storyEnded) {
      console.log("found story in progress", story)
      // hack
      if (story.text.nextUpdateTime === -1) story.text.nextUpdateTime = Number(story.endTime)
      storiesSoFar[storyIndex].inProgress.push(story)
    } else if (storyEnded && !auctionEnded) {
      storiesSoFar[storyIndex].onAuction.push(story)
    } else if (storyEnded && auctionEnded) {
      storiesSoFar[storyIndex].completed.push(story)
    }
    storiesSoFar[storyIndex].upcoming.sort(sortStories)
    storiesSoFar[storyIndex].inProgress.sort(sortStories)
    storiesSoFar[storyIndex].onAuction.sort(sortStories)
    storiesSoFar[storyIndex].completed.sort(sortStories)
  }
  return storiesSoFar
}
