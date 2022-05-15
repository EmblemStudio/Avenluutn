import React from 'react'
import { Link } from 'react-router-dom'

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
          <div className="is-vertical has-text-centered is-ibm is-size-6">
          </div>
        </div>
      </div>
    </nav>
  )
}
