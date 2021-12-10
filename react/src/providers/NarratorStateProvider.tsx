import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, StoriesByGuild, NarratorState, presentOrPast } from '../utils'
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
  updateNarrator: () => {},
  lastUpdate: 0
})

export default ({ params, children }: { params: NarratorParams, children: ReactElement }) => {
  const [narratorState, setNarratorState] = useState<NarratorState>({
    narrator: emptyNarrator,
    updateNarrator: () => {},
    lastUpdate: 0
  })

  // TODO narrator should reload if cache is stale on page load
  // TODO narrator statue is re-rendering or updating too many times
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

async function updateNarratorState(
  narratorState: NarratorState, 
  setNarratorState: React.Dispatch<React.SetStateAction<NarratorState>>,
  params: NarratorParams, 
) {
  if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
    return
  }

  const address = ADDRESSES[params.network]
  requireDefined(address, "Address for ${params.netowrk} required")
  const publisher = useContractReadable(address, artifact.abi, params.network)
  if (!publisher) return

  const baseAuctionDuration = await publisher.baseAuctionDuration()
  const narratorData = await publisher.narrators(params.narratorIndex)
  let newNarrator: Narrator = {...narratorData, collections: [], stories: {}}
  const totalCollections = Number(newNarrator.totalCollections)
  const timeActive = now() - Number(newNarrator.start)
  const relevantStories = Math.floor(
    timeActive / Number(newNarrator.collectionSpacing)
  ) + 2
  console.log({
    timeActive,
    relevantStories,
    collectionSpacing: Number(newNarrator.collectionSpacing),
    narratorStart: Number(newNarrator.start),
    now: now(),
  })
  const promises: Promise<void>[] = []
  for (let i = 0; i < Math.min(relevantStories, totalCollections); i++) {
    promises.push(new Promise(
      async () => {
        const collection = await getCollection(params.narratorIndex, i)
        if (collection) {
          newNarrator.collections.push(collection)
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
        }
        setNarratorState({
          narrator: newNarrator,
          updateNarrator: () => { updateNarratorState(narratorState, setNarratorState, params) },
          lastUpdate: Date.now()
        })
        console.log(narratorState, newNarrator)
      }
    ))
  }
  await Promise.all(promises)
  console.log('awaited all promises')
}

function sortStories(s1: Story, s2: Story) { return Number(s1.startTime.sub(s2.startTime)) }

async function getCollection(
  narratorIndex: number,
  collectionIndex: number
): Promise<Collection | null> {
  const response = await axios.get(`${SERVER}/runs/${narratorIndex}/${collectionIndex}`)
  if (!response.data) return null
  const scriptResult: ScriptResult = response.data
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
    const text = scriptResult.stories[j]
    if (text === undefined) {
      console.warn("scriptResult missing story at index", j)
      continue
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
    const storyEnded = presentOrPast(story.endTime)
    const auctionEnded = presentOrPast(story.endTime.add(story.auction.duration))
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
