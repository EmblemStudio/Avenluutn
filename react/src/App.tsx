import React from 'react'
import {
  Provider as WagmiProvider,
  InjectedConnector,
  WalletConnectConnector,
  WalletLinkConnector,
  chain,
  defaultChains,
  defaultL2Chains,
  developmentChains,
} from 'wagmi'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'
import { providers } from 'ethers'

import './App.css'
import NotificationsProvider from './providers/NotificationsProvider'
import NarratorStateProvider from './providers/NarratorStateProvider'
import { NARRATOR_PARAMS, NETWORK_IDS, RPC_URIS } from './constants'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildAuctions from './pages/GuildAuctions'
import GuildLogbook from './pages/GuildLogbook'
import About from './pages/About'

// This is copy-pasted from the Wagmi examples, and I don't completely understand it
// How is chainId being passed in here?
const chains = [...defaultChains, ...defaultL2Chains, ...developmentChains]

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
    new WalletLinkConnector({
      chains,
      options: {
        appName: 'wagmi',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ]
}
const provider = ({ chainId }: Config) =>
  new providers.InfuraProvider(chainId, infuraId)
const webSocketProvider = ({ chainId }: Config) =>
  new providers.InfuraWebSocketProvider(chainId, infuraId)

export default () => {
  return (
    <div className="App">
      <WagmiProvider 
        autoConnect
        connectorStorageKey="wagmi.wallet"
        connectors={connectors}
        provider={provider}
        webSocketProvider={webSocketProvider}
      >
        <NotificationsProvider>
          <NarratorStateProvider params={NARRATOR_PARAMS}>
            <BrowserRouter>
              <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:guildId/lobby" element={<GuildLobby />} />
                    <Route path="/:guildId/auctions" element={<GuildAuctions />} />
                    <Route path="/:guildId/logbook" element={<GuildLogbook />} />
                    <Route path="/about" element={<About />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </NarratorStateProvider>
        </NotificationsProvider>
      </WagmiProvider>
    </div>
  )
}