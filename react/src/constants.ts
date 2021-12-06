type NetworkName = "mainnet" | "ropsten" | "polygon"

interface NarratorParams {
  network: NetworkName,
  narratorIndex: number
}

export const NARRATOR_PARAMS: NarratorParams = {
  network: "ropsten",
  narratorIndex: 6
}

export const NETWORK_IDS: { [key in NetworkName]: number } = {
  "mainnet": 1,
  "ropsten": 3,
  "polygon": 137
}

export const WARNINGS = {
  no_connection: `connect to ${NARRATOR_PARAMS.network} to bid or claim`,
  wrong_network: `switch to ${NARRATOR_PARAMS.network} to bid or claim`
}

export const STATUS = {
  tx_submitted: `transaction submitted--awaiting confirmation`,
  tx_confirmed: `transacton confirmed`
}

export const ADDRESSES: { [name: string]: string } = {
  "mainnet": "",
  "ropsten": "0x9Ee5716bd64ec6e90e0a1F44C5eA346Cd0a8E5a4",
  "polygon": ""
}

export const SERVER = "http://67.205.138.92"

export const CACHE_PERIOD = 180000 // 3 minutes

export const API_URIS: { [network: string]: string } = {
  ropsten: "https://eth-ropsten.alchemyapi.io/v2/tDTu2vhfHnGOWJuM0p1DrA6BBJn0uDL3"
}

export const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]
export const DEFAULT_COLOR = "gray"

export const LOADING = ". . ."

export const etherscanBases: { [key in NetworkName]: string }  = {
  "ropsten": "https://ropsten.etherscan.io/",
  "mainnet": "https://www.etherscan.io/",
  "polygon": "https://polygonscan.com/"
}

const etherscanBase = etherscanBases[NARRATOR_PARAMS.network]

export const GITHUB = "https://github.com/EmblemStudio/Aavenluutn"
export const ETHERSCAN = `${etherscanBase}address/${ADDRESSES.ropsten}`
export const DISCORD = "https://discord.gg/VfvtD6NDuM"
