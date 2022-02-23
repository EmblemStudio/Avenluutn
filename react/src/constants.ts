import { NetworkName } from './utils'
import env from "../.env.json"

interface NarratorParams {
  network: NetworkName,
  narratorIndex: number
}

export const currentRelease = "goerli"
let network
if (window !== undefined) {
  if (window.location.host === 'localhost:3000') {
    network = "localhost"
  }
}

export const NARRATOR_PARAMS: NarratorParams = {
  network: network ? network : currentRelease,
  narratorIndex: 0,
}

export const NETWORK_IDS: { [key in NetworkName]: number } = {
  "mainnet": 1,
  "ropsten": 3,
  "goerli": 5,
  "polygon": 137,
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

// Publishers
export const ADDRESSES: { [name: string]: string } = {
  "mainnet": "",
  "ropsten": "0x2A7b3033c100044178E7c7FDdC939Be660178458",
  "goerli": "0x6bb7758DB5b475B4208A5735A8023fdEdD753aaf",
  "polygon": "",
  "localhost": "0xD84379CEae14AA33C123Af12424A37803F885889",
}

export const SERVER = {
  "localhost": "http://localhost",
  "mainnet": "http://67.205.138.92",
  "ropsten": "http://67.205.138.92",
  "polygon": "http://67.205.138.92",
  "goerli": "https://avenluutn-api.squad.games",
}[NARRATOR_PARAMS.network]

export const CACHE_PERIOD = 180000 // 3 minutes

export const RPC_URIS: { [key in NetworkName]: string } = env.RPC_URIS

export const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]
export const DEFAULT_COLOR = "gray"

export const LOADING = ". . ."
export const WAITING_FOR_SERVER = "The bard is scribbling..."

export const etherscanBases: { [key in NetworkName]: string }  = {
  "ropsten": "https://ropsten.etherscan.io/",
  "mainnet": "https://www.etherscan.io/",
  "polygon": "https://polygonscan.com/",
  "goerli": "https://goerli.etherscan.io/",
  "localhost": "",
}

const etherscanBase = etherscanBases[NARRATOR_PARAMS.network]

export const GITHUB = "https://github.com/EmblemStudio/Aavenluutn"
export const ETHERSCAN = `${etherscanBase}address/${ADDRESSES[NARRATOR_PARAMS.network]}`
export const DISCORD = "https://discord.gg/VfvtD6NDuM"

export const currencyName = "crin"
export const defaultBetAmount = 50
export const defaultBalance = 1000
