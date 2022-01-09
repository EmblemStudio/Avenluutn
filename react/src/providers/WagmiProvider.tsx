import React, { ReactElement } from 'react'
import {
  Provider,
  chain,
  defaultChains,
  defaultL2Chains,
  developmentChains
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import { providers } from 'ethers'

// Disclaimer: this is copy-pasted from the Wagmi examples, and I don't completely understand it
const chains = [...defaultChains, ...defaultL2Chains, ...developmentChains]

// TODO move everything to private / local env 
const infuraId = "f13aa25ab1994feba460795247d5d002"

type Config = { chainId?: number }
const connectors = ({ chainId }: Config) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    // This was causing an error
    /*
    new WalletLinkConnector({
      chains,
      options: {
        appName: 'wagmi',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    })
    */
  ]
}
const provider = ({ chainId }: Config) => 
  new providers.InfuraProvider(chainId, infuraId)
const webSocketProvider = ({ chainId }: Config) =>
  new providers.InfuraWebSocketProvider(chainId, infuraId)

export default ({ children }: { children: ReactElement }) => {
  return (
    <Provider 
      autoConnect
      connectorStorageKey="wagmi.wallet"
      connectors={connectors}
      provider={provider}
      webSocketProvider={webSocketProvider}
    >
      {children}
    </Provider>
  )
}