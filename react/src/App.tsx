import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import WagmiProvider from './providers/WagmiProvider'
import NotificationsProvider from './providers/NotificationsProvider'
import NarratorStateProvider from './providers/NarratorStateProvider'
import UserProvider from './providers/UserProvider'
import QueryProvider from './providers/QueryProvider'
import { NARRATOR_PARAMS } from './constants'
import Layout from './components/Layout'
import Home from './pages/Home'
import GuildLobby from './pages/GuildLobby'
import GuildLogbook from './pages/GuildLogbook'
import GuildDossier from './pages/GuildDossier'
import EmbassyChamber from './pages/EmbassyChamber'
import EmbassyLounge from './pages/EmbassyLounge'
import EmbassyLogbook from './pages/EmbassyLogbook'
import About from './pages/About'
import Adventurer from './pages/Adventurer'
import Story from './pages/Story'
import MyAccount from './pages/MyAccount'

// the whole NarratorStateProvider needs to deal with multiple narrators
// but we'd like loading the site to only require loading the latest narrator and 
// then load earlier ones only on demand
// but once we load them, we don't want to have to reload them

export default () => {
  return (
    <div className="App">
      <WagmiProvider>
        <NotificationsProvider>
          <NarratorStateProvider>
            <UserProvider>
              <QueryProvider>
                <BrowserRouter>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/:guildId/lobby" element={<GuildLobby />} />
                      <Route path="/:guildId/dossier" element={<GuildDossier />} />
                      <Route path="/:guildId/logbook" element={<GuildLogbook />} />
                      <Route path="/:guildId/adventurers/:adventurerId" element={<Adventurer graveyard={false} />} />
                      <Route path="/:guildId/graveyard/:adventurerId" element={<Adventurer graveyard={true} />} />
                      <Route path="/:guildId/stories/:collectionId" element={<Story />} />
                      <Route path="/embassy/chamber" element={<EmbassyChamber />} />
                      <Route path="/embassy/lounge" element={<EmbassyLounge />} />
                      <Route path="/embassy/logbook" element={<EmbassyLogbook />} />
                      <Route path="/my-account" element={<MyAccount />} />
                      <Route path="/about" element={<About />} />
                    </Routes>
                  </Layout>
                </BrowserRouter>
              </QueryProvider>
            </UserProvider>
          </NarratorStateProvider>
        </NotificationsProvider>
      </WagmiProvider>
    </div>
  )
}
