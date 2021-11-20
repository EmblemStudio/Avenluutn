import { BigNumber } from '@ethersproject/bignumber'
import { Story as StoryText } from '../../../scripts/src'

export interface Narrator {
  NFTAddress: string;
  NFTId: BigNumber;
  start: BigNumber;
  totalCollections: BigNumber;
  collectionLength: BigNumber;
  collectionSpacing: BigNumber;
  collectionSize: BigNumber;
  stories: Stories;
}

export interface Story {
  narratorIndex: number;
  collectionIndex: number;
  storyIndex: number;
  id: string;
  startTime: BigNumber;
  endTime: BigNumber;
  auction: Auction;
  text: StoryText;
}

export interface Stories { 
  [storyIndex: number]: Story[] 
}

export interface Auction {
  bidAmount: number;
  bidder: string;
  timeLeft: number;
}