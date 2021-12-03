import React, { useState, useEffect, createContext, ReactElement } from 'react'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import axios from 'axios'

import useContractReadable from '../hooks/useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult } from '../../../scripts/src'
import { NarratorParams, Narrator, Auction, Collection, Story, StoriesByGuild, CategorizedStories, presentOrPast } from '../utils'
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
    console.log('narrator use effect')
    if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
      return
    }
    
    const address = ADDRESSES[params.network]
    const publisher = useContractReadable(address, artifact.abi, params.network)
    if (!publisher) return

    publisher.baseAuctionDuration()
      .then((baseAuctionDuration: BigNumber) => {
        publisher.narrators(params.narratorIndex)
        .then((nData: any) => {
          let newNarrator: Narrator = {
            ...nData,
            collections: [],
            stories: {}
          }
          const totalCollections = Number(newNarrator.totalCollections)
          for (let i = 0; i < totalCollections; i++) {
            getCollection(params.narratorIndex, i)
              .then(c => {
                if (c) {
                  newNarrator.collections.push(c)
                  concatCategorizedStories(
                    publisher, 
                    baseAuctionDuration,
                    params.narratorIndex,
                    Number(newNarrator.collectionSize),
                    newNarrator.collectionLength,
                    c,
                    newNarrator.stories,
                    c.scriptResult
                  )
                    .then((newStories: StoriesByGuild) => {
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