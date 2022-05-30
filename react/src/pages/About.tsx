import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <>
      <div className="block">
        <div className="block has-text-grey">
          The Grand Adventure: Avenluutn is a multi-player, cross-platform choose-your-own-adventure
          that takes place in a fantasy world.
        </div>
        <div className="block has-text-grey">
          Players take the role of emissaries to the town of Avenluutn. Each season, they vote
          to decide how the town will do its business of adventuring and how it will deal
          with the repercussions.
        </div>
      </div>
      <Link to="/">
        <div className="is-underlined has-text-white">
          Back
        </div>
      </Link>
    </>
  )
}