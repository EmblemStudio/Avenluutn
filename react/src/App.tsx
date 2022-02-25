import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import WagmiProvider from './providers/WagmiProvider'
import NotificationsProvider from './providers/NotificationsProvider'
import NarratorStateProvider from './providers/NarratorStateProvider'
import UserContext, { defaultUser } from './providers/UserContext'
import { NARRATOR_PARAMS } from './constants'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildLogbook from './pages/GuildLogbook'
import About from './pages/About'
import GuildDossier from './pages/GuildDossier'
import Adventurer from './pages/Adventurer'
import MyBets from './pages/MyBets'
import { useStorage } from './hooks/useStorage'

export default () => {
  const [balance, setBalance] = useStorage("balance", 1000)
  const [bets, setBets] = useStorage("bets", [])
  const storedUser = { balance, bets }
  return (
    <div className="App">
      <WagmiProvider>
        <NotificationsProvider>
          <NarratorStateProvider params={NARRATOR_PARAMS}>
            <UserContext.Provider value={storedUser}>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:guildId/lobby" element={<GuildLobby />} />
                    <Route path="/:guildId/dossier" element={<GuildDossier />} />
                    <Route path="/:guildId/auctions" element={<GuildAuctions />} />
                    <Route path="/:guildId/logbook" element={<GuildLogbook />} />
                    <Route path="/:guildId/adventurers/:adventurerId" element={<Adventurer graveyard={false} />} />
                    <Route path="/:guildId/graveyard/:adventurerId" element={<Adventurer graveyard={true} />} />
                    <Route path="/my-bets" element={<MyBets />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </UserContext.Provider>
          </NarratorStateProvider>
        </NotificationsProvider>
      </WagmiProvider>
    </div>
  )
}
