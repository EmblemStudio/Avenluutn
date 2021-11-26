import React from 'react'
import { UseWalletProvider } from 'use-wallet'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import NotificationsProvider from './providers/NotificationsProvider'
import NarratorStateProvider from './providers/NarratorStateProvider'
import { NARRATOR_PARAMS } from './constants'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildAuctions from './pages/GuildAuctions'
import GuildLogbook from './pages/GuildLogbook'

export default () => {
  return (
    <div className="App">
      <UseWalletProvider>
        <NotificationsProvider>
          <NarratorStateProvider params={NARRATOR_PARAMS}>
            <BrowserRouter>
              <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:guildId/lobby" element={<GuildLobby />} />
                    <Route path="/:guildId/auctions" element={<GuildAuctions />} />
                    <Route path="/:guildId/logbook" element={<GuildLogbook />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </NarratorStateProvider>
        </NotificationsProvider>
      </UseWalletProvider>
    </div>
  )
}