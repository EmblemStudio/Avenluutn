import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import WagmiProvider from './providers/WagmiProvider'
import NotificationsProvider from './providers/NotificationsProvider'
import NarratorStateProvider from './providers/NarratorStateProvider'
import UserProvider from './providers/UserProvider'
import { NARRATOR_PARAMS } from './constants'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildLogbook from './pages/GuildLogbook'
import About from './pages/About'
import GuildDossier from './pages/GuildDossier'
import Adventurer from './pages/Adventurer'
import MyAccount from './pages/MyAccount'

export default () => {
  return (
    <div className="App">
      <WagmiProvider>
        <NotificationsProvider>
          <NarratorStateProvider params={NARRATOR_PARAMS}>
            <UserProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:guildId/lobby" element={<GuildLobby />} />
                    <Route path="/:guildId/dossier" element={<GuildDossier />} />
                    <Route path="/:guildId/logbook" element={<GuildLogbook />} />
                    <Route path="/:guildId/adventurers/:adventurerId" element={<Adventurer graveyard={false} />} />
                    <Route path="/:guildId/graveyard/:adventurerId" element={<Adventurer graveyard={true} />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </UserProvider>
          </NarratorStateProvider>
        </NotificationsProvider>
      </WagmiProvider>
    </div>
  )
}
