import { useState, useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'
import axios from 'axios'

import useContractReadable from './useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { ScriptResult } from '../../../scripts/src'
import { Narrator, Auction, Collection } from '../utils'

const addresses: { [network: string]: string } = {
  "ropsten": "0x0533770ca8Fe4fDb4C186aE00363fbFdEEf34efb"
}

const server = "http://67.205.138.92"

async function getCollection(
  publisher: Contract,
  narrator: Narrator, 
  narratorIndex: number,
  collectionIndex: number
): Promise<Collection | null> {
  const response = await axios.get(`${server}/runs/${narratorIndex}/${collectionIndex}`)
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

export default (network: string, narratorIndex: number) => {
  const [narrator, setNarrator] = useState<Narrator | null>(null)

  useEffect(() => {
    // TODO memoize some state
    if (narrator) return

    const address = addresses[network]
    const publisher = useContractReadable(address, artifact.abi, "ropsten")
    if (!publisher) return

    publisher.narrators(narratorIndex)
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
            narratorIndex,
            i
          )
            .then(c => {
              if (c) {
                newNarrator.collections.push(c)
                setNarrator(newNarrator)
              }
            })
        }
      })
  }, [narrator])
  
  return narrator
}