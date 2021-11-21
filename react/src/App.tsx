import React from 'react'
import { UseWalletProvider } from 'use-wallet'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildAuctions from './pages/GuildAuctions'
import GuildLogbook from './pages/GuildLogbook'

export default () => {
  return (
    <div className="App">
      <UseWalletProvider>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:guildId/lobby" element={<GuildLobby />} />
              <Route path="/:guildId/auctions" element={<GuildAuctions />} />
              <Route path="/:guildId/logbook" element={<GuildLogbook />} />
          </Routes>
        </BrowserRouter>
      </UseWalletProvider>
    </div>
  )
}