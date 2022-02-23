import React from 'react'
import { Link } from 'react-router-dom'
import Balance from './Balance'

import ConnectButton from './ConnectButton'

export default () => {
  return (
    <nav className="level mt-5 mb-0 mr-5 ml-5">
      <div className="level-left">
        <div className="level-item">
          <Link to="/">
            <div className="block has-text-centered mb-0">
              <h2 className="subtitle has-text-white">The Grand Adventure:</h2>
            </div>
            <div className="block has-text-centered">
              <h1 className="title">Avenluutn</h1>
            </div>
          </Link>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <Balance />
          <a className="button is-underlined is-ghost is-medium is-size-5"
             href="/my-bets">
            My Bets
          </a>
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
