export const NARRATOR_PARAMS = {
  network: "ropsten", 
  narratorIndex: 6
}

export const WARNINGS = {
  no_connection: `connect to ${NARRATOR_PARAMS.network} to bid or claim`,
  wrong_network: `switch to ${NARRATOR_PARAMS.network} to bid or claim`
}

export const ADDRESSES: { [network: string]: string } = {
  "ropsten": "0x0533770ca8Fe4fDb4C186aE00363fbFdEEf34efb"
}

export const SERVER = "http://67.205.138.92"

export const CACHE_PERIOD = 180000 // 3 minutes

export const API_URIS: { [network: string]: string } = {
  ropsten: "https://ropsten.infura.io/v3/46801402492348e480a7e18d9830eab8"
}

export const COLORS = ["green", "red", "blue", "yellow", "purple", "orange"]

export const LOADING = ". . ."

export const GITHUB = "https://github.com/EmblemStudio/Aavenluutn"
export const ETHERSCAN = "https://ropsten.etherscan.io/address/0x0533770ca8fe4fdb4c186ae00363fbfdeef34efb"
export const DISCORD = "https://discord.gg/VfvtD6NDuM"