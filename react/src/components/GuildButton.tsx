import React from 'react'
import { Link } from 'react-router-dom'

import { Guild } from '../../../scripts/src'

export default (guild: Guild) => {
  return (
    <div key={guild.id} className="level-item m-3">
      <Link to="/">
        <div className="guild-card outer-border has-border-green">
          <div className="container has-text-centered inner-border has-border-green has-text-green pt-3 pb-3">
            <div className="block has-text-weight-bold">
              {guild.name}
            </div>
            <div className="block">
              {guild.motto}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}