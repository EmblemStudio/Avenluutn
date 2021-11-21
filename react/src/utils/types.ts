import { BigNumber } from '@ethersproject/bignumber'
import { ScriptResult } from '../../../scripts/src'

export interface Narrator {
  NFTAddress: string;
  NFTId: BigNumber;
  start: BigNumber;
  totalCollections: BigNumber;
  collectionLength: BigNumber;
  collectionSpacing: BigNumber;
  collectionSize: BigNumber;
  collections: Collection[];
}

export interface Collection {
  collectionIndex: number;
  scriptResult: ScriptResult;
  stories: Story[];
}

export interface Story {
  narratorIndex: number;
  collectionIndex: number;
  storyIndex: number;
  id: string;
  startTime: BigNumber;
  endTime: BigNumber;
  auction: Auction;
}

export interface Auction {
  bidAmount: number;
  bidder: string;
  timeLeft: number;
}