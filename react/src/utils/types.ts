import { BigNumber } from '@ethersproject/bignumber'
import { ScriptResult, Story as StoryText, Success, Result } from '../../../scripts/src'

export type NetworkName = "mainnet" | "ropsten" | "polygon" | "polygon testnet mumbai" | "localhost" | "goerli"

export interface Notifications {
  warnings: string[];
  errors: string[];
  status: string[];
}

export type NotificationFunction = (type: "errors" | "warnings" | "status", text: string) => void

export interface NarratorParams { network: string; narratorIndex: number }

export interface NarratorState {
  narrator: Narrator,
  updateNarrator: () => void,
  lastUpdate: number,
  queryUntilUpdate: (state: NarratorState, collectionIndex: number, storyIndex: number) => void,
  querying: boolean,
  loadState: "loading" | "finished"
}

export interface NarratorContractData {
  NFTAddress: string;
  NFTId: BigNumber;
  collectionLength: BigNumber;
  collectionSize: BigNumber;
  collectionSpacing: BigNumber;
  start: BigNumber;
  totalCollections: BigNumber;
}

// TODO stories should be stored in a dictionary by ID, categorized stories should just reference IDs
export interface Narrator extends NarratorContractData {
  collections: Collection[];
  stories: { [id: string]: Story };
  storiesByGuild: StoriesByGuild;
  eventsByGuild: { [guildId: number]: Event[] };
}

export enum EventType {
  result,
  adventureStart,
  adventureEnd
}

export interface Event {
  result?: Result;
  storyId: string;
  timestamp: number;
  type: EventType;
}

export interface Collection {
  collectionIndex: number;
  scriptResult: ScriptResult;
}

export interface StoriesByGuild { [guildId: number]: CategorizedStories };

export interface CategorizedStories {
  upcoming: string[];
  inProgress: string[];
  onAuction: string[];
  completed: string[];
}

export interface Story {
  narratorIndex: number;
  collectionIndex: number;
  storyIndex: number;
  startTime: BigNumber;
  endTime: BigNumber;
  auction: Auction;
  minted: boolean;
  nftId: BigNumber;
  text: StoryText;
}

export enum StoryCategory {
  upcoming,
  inProgress,
  onAuction,
  completed,
  unknown
}

export interface Auction {
  amount: BigNumber;
  bidder: string;
  duration: BigNumber;
}

export interface User {
  balance: number
  shares: { [shareId: string]: Share }
}

export interface Share {
  shareId: string;
  // story id
  narratorIndex: number;
  collectionIndex: number;
  storyIndex: number;
  //
  outcome: Success;
  resolved: boolean;
}
