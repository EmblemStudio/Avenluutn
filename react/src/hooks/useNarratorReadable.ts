import { useState, useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'
import axios from 'axios'

import useContractReadable from './useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult } from '../../../scripts/src'
import { Narrator, Auction, Collection, setNarratorState } from '../utils'
import narratorState from '../state/narratorState'
import { ADDRESSES, SERVER, CACHE_PERIOD } from '../constants'

async function getCollection(
  publisher: Contract,
  narrator: Narrator, 
  narratorIndex: number,
  collectionIndex: number
): Promise<Collection | null> {
  const response = await axios.get(`${SERVER}/runs/${narratorIndex}/${collectionIndex}`)
  if (!response.data) return null
  const scriptResult: ScriptResult = response.data
  const collection: Collection = {
    collectionIndex,
    scriptResult,
    stories: []
  }
  for (let j = 0; j < Number(narrator.collectionSize); j++) {
    const storyIndex = j
    const id = await publisher.getStoryId(narratorIndex, collectionIndex, storyIndex)
    const startTime = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
    const endTime = startTime.add(narrator.collectionLength)
    const story = await publisher.stories(id)
    const auction: Auction = story.auction
    collection.stories.push({
      narratorIndex,
      collectionIndex,
      storyIndex,
      id,
      startTime,
      endTime,
      auction
    })
  }
  return collection
}

interface UseNarratorReadableParams { network: string; narratorIndex: number }

export default (params: UseNarratorReadableParams) => {
  const [narrator, setNarrator] = useState<Narrator | null>(null)

  useEffect(() => {
    if (narratorState.lastUpdate > Date.now() - CACHE_PERIOD) {
      setNarrator(narratorState.narrator)
      return
    }

    const address = ADDRESSES[params.network]
    const publisher = useContractReadable(address, artifact.abi, "ropsten")
    if (!publisher) return

    publisher.narrators(params.narratorIndex)
      .then((nData: any) => {
        let newNarrator = {
          ...nData,
          collections: []
        }
        const totalCollections = Number(newNarrator.totalCollections)
        for (let i = 0; i < totalCollections; i++) {
          getCollection(
            publisher,
            newNarrator,
            params.narratorIndex,
            i
          )
            .then(c => {
              if (c) {
                newNarrator.collections.push(c)
                setNarrator(newNarrator)
                setNarratorState(newNarrator)
              }
            })
        }
      })
  }, [narrator])
  
  return narrator
}