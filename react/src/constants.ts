type NetworkName = "mainnet" | "ropsten" | "polygon" | "localhost" | "goerli"

interface NarratorParams {
  network: NetworkName,
  narratorIndex: number
}

export const NARRATOR_PARAMS: NarratorParams = {
  network: "localhost",
  narratorIndex: 2,
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

export const ADDRESSES: { [name: string]: string } = {
  "mainnet": "",
  "ropsten": "0x2A7b3033c100044178E7c7FDdC939Be660178458",
  "goerli": "0x854757c41Ba48ad8C53cF1890B2B8672ad8b0c15",
  "polygon": "",
  "localhost": "0x720472c8ce72c2A2D711333e064ABD3E6BbEAdd3",
}

export const SERVER = {
  "localhost": "http://localhost:8000",
  "mainnet": "http://67.205.138.92",
  "ropsten": "http://67.205.138.92",
  "polygon": "http://67.205.138.92",
  "goerli": "http://67.205.138.92",
}[NARRATOR_PARAMS.network]

export const CACHE_PERIOD = 180000 // 3 minutes

export const API_URIS: { [network: string]: string } = {
  ropsten: "https://eth-ropsten.alchemyapi.io/v2/tDTu2vhfHnGOWJuM0p1DrA6BBJn0uDL3",
  goerli: "https://eth-goerli.alchemyapi.io/v2/tDTu2vhfHnGOWJuM0p1DrA6BBJn0uDL3",
  localhost: "http://localhost:8545",
}

export const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]
export const DEFAULT_COLOR = "gray"

export const LOADING = ". . ."

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
