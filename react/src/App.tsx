import React, { useState } from 'react'
import { useWallet, UseWalletProvider } from 'use-wallet'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bulma'

import './App.css'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <UseWalletProvider>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </UseWalletProvider>
    </div>
  )
}

export default App

/*
<header className="App-header">
        <p>
          Aavenluutn
          <br />
          <span className="subtitle">(AH-ven-LOO-tn)</span>
        </p>
      </header>
      <p>
        Adventure stories in the <a
                                   target="_blank"
                                   href="https://lootproject.com"
                                 >lootverse</a>
        .
      </p>

      <footer>
        <p> By <a href="https://squad.games">Squad.Games</a></p>
      </footer>
      */