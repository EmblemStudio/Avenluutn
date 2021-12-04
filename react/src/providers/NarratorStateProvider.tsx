import assert from 'assert'
import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, CategorizedStories, presentOrPast } from '../utils'
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
  stories: {
    upcoming: [],
    inProgress: [],
    onAuction: [],
    completed: []
  }
}

// requireDefined asserts that the value is just the value as opposed to nothing
function requireDefined<T>(val: T, msg?: string): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      msg ?? `'val' required to be defined, but received ${val}`
    );
  }
}

export const NarratorStateContext = createContext({
  narratorState: {
    narrator: emptyNarrator,
    lastUpdate: 0
  }
})

export default ({ params, children }: { params: NarratorParams, children: ReactElement }) => {
  const [narratorState, setNarratorState] = useState({
    narrator: emptyNarrator,
    lastUpdate: 0
  })

  useEffect(() => {
    if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
      return
    }

    const address = ADDRESSES[params.network]
    requireDefined(address, "Address for ${params.netowrk} required")
    const publisher = useContractReadable(address, artifact.abi, params.network)
    if (!publisher) return

    publisher.narrators(params.narratorIndex)
      .then((nData: any) => {
        console.log('data', nData)
        let newNarrator: Narrator = {
          ...nData,
          collections: [],
          stories: {
            upcoming: [],
            inProgress: [],
            onAuction: [],
            completed: []
          }
        }

        const totalCollections = Number(newNarrator.totalCollections)
        console.log('total', totalCollections)
        for (let i = 0; i < totalCollections; i++) {
          getCollection(params.narratorIndex, i)
            .then(c => {
              if (c) {
                console.log('c', c)
                newNarrator.collections.push(c)
                concatCategorizedStories(
                  publisher,
                  params.narratorIndex,
                  Number(newNarrator.collectionSize),
                  newNarrator.collectionLength,
                  c,
                  newNarrator.stories,
                  c.scriptResult
                )
                  .then((newStories: CategorizedStories) => {
                    console.log('stories', newStories)
                    newNarrator.stories = newStories
                    setNarratorState({
                      narrator: newNarrator,
                      lastUpdate: Date.now()
                    })
                  })
              }
            })
        }
      })
  }, [narratorState])

  return (
    <NarratorStateContext.Provider value={{ narratorState }}>
      {children}
    </NarratorStateContext.Provider>
  )
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
  narratorIndex: number,
  collectionSize: number,
  collectionLength: BigNumber,
  collection: Collection,
  storiesSoFar: CategorizedStories,
  scriptResult: ScriptResult,
): Promise<CategorizedStories> {
  const collectionIndex = collection.collectionIndex
  for (let j = 0; j < collectionSize; j++) {
    const storyIndex = j
    const id = await publisher.getStoryId(narratorIndex, collectionIndex, storyIndex)
    console.log('id', id)
    const startTime = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
    console.log('start time', startTime)
    const endTime = startTime.add(collectionLength)
    const contractStory = await publisher.stories(id)
    console.log('contract story', contractStory)
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
      text
    }
    const started = presentOrPast(story.startTime)
    const ended = presentOrPast(story.endTime)
    if (!started) {
      storiesSoFar.upcoming.push(story)
    } else if (started && !ended) {
      storiesSoFar.inProgress.push(story)
    } else if (ended && story.auction.duration.gt(0)) {
      storiesSoFar.onAuction.push(story)
    } else if (ended && story.auction.duration.isZero()) {
      storiesSoFar.completed.push(story)
    }
  }
  storiesSoFar.upcoming.sort(sortStories)
  storiesSoFar.inProgress.sort(sortStories)
  storiesSoFar.onAuction.sort(sortStories)
  storiesSoFar.completed.sort(sortStories)
  return storiesSoFar
}
