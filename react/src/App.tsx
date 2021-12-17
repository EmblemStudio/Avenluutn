import React from 'react'
import { UseWalletProvider } from 'use-wallet'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

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

export default () => {
  console.log({ 
    [NETWORK_IDS[NARRATOR_PARAMS.network]]: RPC_URIS[NARRATOR_PARAMS.network]
  })
  return (
    <div className="App">
      <UseWalletProvider
        connectors={{
          walletconnect: {
            rpc: { 
              [NETWORK_IDS[NARRATOR_PARAMS.network]]: RPC_URIS[NARRATOR_PARAMS.network]
            },
          },
        }}
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
      </UseWalletProvider>
    </div>
  )
}