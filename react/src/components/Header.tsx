import React from 'react'
import { Link } from 'react-router-dom'

import ConnectButton from './ConnectButton'

export default function Header() {
  return (
    <nav className="level mt-5 mr-5 ml-5">
      <div className="level-left">
        <div className="level-item">
          <Link to="/">
            <h1 className="title">The Grand Adventure</h1>
          </Link>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}