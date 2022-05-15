import { NetworkName, firstArrayElement } from './utils'
import env from "../.env.json"

interface NarratorParams {
  network: NetworkName,
  narratorIndex: number
}

/***** CHANGE THEeSE!!! ????**/

export const STORAGE_VERSION = "0.0.0"
/** remove? */
export const currentRelease: NetworkName = "polygon testnet mumbai"
export const PAST_NARRATOR_INDICES: { [key in NetworkName]: number[] } = {
  "mainnet": [],
  "ropsten": [],
  "goerli": [],
  "polygon mainnet": [0],
  "polygon testnet mumbai": [12],
  "localhost": []
}
/** */
export const NETWORK: NetworkName = "polygon testnet mumbai"
// add latest narrator to BEGINNING of array
export const NARRATOR_INDICES: { [key in NetworkName]: number[] } = {
  "mainnet": [],
  "ropsten": [],
  "goerli": [],
  "polygon mainnet": [0],
  "polygon testnet mumbai": [12],
  "localhost": []
}
export let currentNarrator = 0
export const localTestNarrator = 0

let localhostAddress = import.meta.env.REACT_APP_LOCALHOST_PUB_ADDR
if (typeof localhostAddress === "boolean" || localhostAddress === undefined) {
  localhostAddress = ""
}
// Publishers
export const ADDRESSES: { [key in NetworkName]: string } = {
  "mainnet": "",
  "ropsten": "0x2A7b3033c100044178E7c7FDdC939Be660178458",
  "goerli": "0x6bb7758DB5b475B4208A5735A8023fdEdD753aaf",
  "polygon mainnet": "0x3cc6Ce718E778c471d4183A625eB4446503f947b",
  "polygon testnet mumbai": "0x9Ee5716bd64ec6e90e0a1F44C5eA346Cd0a8E5a4",
  "localhost": localhostAddress,
  // change in project root .env file! (avenluutn/.env is linked to avenluutn/react/.env)
}

export const NATIVE_TOKENS: { [key in NetworkName]: string } = {
  "mainnet": "ETH",
  "ropsten": "ETH",
  "goerli": "ETH",
  "polygon mainnet": "MATIC",
  "polygon testnet mumbai": "MATIC",
  "localhost": "ETH",
}

/***** CHANGE THEeSE!!! ????**/
/*
let network
if (window !== undefined) {
  if (window.location.host === '127.0.0.1:3000') {
    network = "polygon testnet mumbai" as NetworkName
    currentNarrator = localTestNarrator
  }
}
*/

export const NARRATOR_PARAMS: NarratorParams = {
  network: currentRelease,
  narratorIndex: firstArrayElement(PAST_NARRATOR_INDICES[currentRelease])
}

export const NETWORK_IDS: { [key in NetworkName]: number } = {
  "mainnet": 1,
  "ropsten": 3,
  "goerli": 5,
  "polygon mainnet": 137,
  "polygon testnet mumbai": 80001,
  "localhost": 31337,
}

export const WARNINGS = {
  no_connection: `connect to ${NARRATOR_PARAMS.network} to bid or claim`,
  wrong_network: `switch to ${NARRATOR_PARAMS.network} to bid or claim`
}

export const STATUS = {
  tx_submitted: `transaction submitted--awaiting confirmation`,
  tx_confirmed: `transacton confirmed`
}

export const SERVER = {
  "localhost": "http://localhost",
  "mainnet": "http://67.205.138.92",
  "ropsten": "http://67.205.138.92",
  "polygon mainnet": "https://avenluutn-api.squad.games",
  // TODO should be swapped back to non-dev once votes are up there
  "polygon testnet mumbai": "https://avenluutn-api-dev.squad.games",
  "goerli": "https://avenluutn-api-dev.squad.games",
}[NARRATOR_PARAMS.network]

export const CACHE_PERIOD = 180000 // 3 minutes

// TODO consolidate configuration either here or into env
export const RPC_URIS: { [key in NetworkName]: string } = env.RPC_URIS

export const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]
export const DEFAULT_COLOR = "gray"

export const LOADING = ". . ."
export const WAITING_FOR_SERVER = "The bard is scribbling..."

export const etherscanBases: { [key in NetworkName]: string } = {
  "ropsten": "https://ropsten.etherscan.io/",
  "mainnet": "https://www.etherscan.io/",
  "polygon mainnet": "https://polygonscan.com/",
  "polygon testnet mumbai": "https://polygon testnet mumbai.polygonscan.com/",
  "goerli": "https://goerli.etherscan.io/",
  "localhost": "",
}

const etherscanBase = etherscanBases[NARRATOR_PARAMS.network]

export const GITHUB = "https://github.com/EmblemStudio/Aavenluutn"
export const ETHERSCAN = `${etherscanBase}address/${ADDRESSES[NARRATOR_PARAMS.network]}`
export const DISCORD = "https://discord.gg/VfvtD6NDuM"

export const CURRENCY = "crin"
export const SHARE_PRICE = 50

export const SHARE_PAYOUTS = {
  0: 0,
  1: 100,
  2: 150
}
