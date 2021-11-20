import { Contract } from '@ethersproject/contracts'
import axios from 'axios'

import useContractReadable from './useContractReadable'
import artifact from '../../../hardhat/artifacts/contracts/Publisher.sol/Publisher.json'
import { Story as StoryText } from '../../../scripts/src'
import { Narrator, Stories, Auction } from '../utils'

const addresses: { [network: string]: string } = {
  "ropsten": "0x0533770ca8Fe4fDb4C186aE00363fbFdEEf34efb"
}

const server = "http://67.205.138.92"

async function setupStories(
  publisher: Contract,
  narrator: Narrator, 
  narratorIndex: number
): Promise<Stories> {
  const stories: Stories = {}
  for (let i = 0; i < Number(narrator.totalCollections); i++) {
    for (let j = 0; j < Number(narrator.collectionSize); j++) {
      const storyIndex = j
      const collectionIndex = i
      const id = await publisher.getStoryId(narratorIndex, collectionIndex, storyIndex)
      const startTime = await publisher.storyStartTime(narratorIndex, collectionIndex, storyIndex)
      const endTime = startTime.add(narrator.collectionLength)
      const story = await publisher.stories(id)
      const auction: Auction = story.auction
      const response = await axios.get(`${server}/stories/${narratorIndex}/${collectionIndex}/${storyIndex}`)
      const text: StoryText = response.data
      if (!stories[j]) stories[j] = []
      stories[j].push({
        narratorIndex,
        collectionIndex,
        storyIndex,
        id,
        startTime,
        endTime,
        auction,
        text
      })
    }
  }
  return stories
}

export default async (network: string, narratorIndex: number) => {
  const address = addresses[network]
  const publisher = useContractReadable(address, artifact.abi, "ropsten")
  if (!publisher) return null
  const narratorData = await publisher.narrators(narratorIndex)
  const narrator: Narrator = Object.assign({}, {
    ...narratorData,
    stories: {}
  })
  narrator.stories = await setupStories(publisher, narrator, narratorIndex)
  console.log(narrator)
  return narrator
}