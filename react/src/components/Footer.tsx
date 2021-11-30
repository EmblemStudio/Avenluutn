import React from 'react'
import { Link } from 'react-router-dom'

import { GITHUB, ETHERSCAN, DISCORD } from '../constants'

export default () => {
  return (
    <nav className="level m-5 is-size-5">
      <div className="level-item has-text-centered">
        <Link to="/about">
          <span className="has-text-white has-hover-underline">About</span>
        </Link>
      </div>
      <div className="level-item has-text-centered">
        <a className="has-text-white has-hover-underline" target="_blank" href={GITHUB}>
          Github
        </a>
      </div>
      <div className="level-item has-text-centered">
        <a className="has-text-white has-hover-underline" target="_blank" href={ETHERSCAN}>
          Etherscan
        </a>
      </div>
      <div className="level-item has-text-centered">
        <a className="has-text-white has-hover-underline" target="_blank" href={DISCORD}>
          Discord
        </a>
      </div>
    </nav>
  )
}