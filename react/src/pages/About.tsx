import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <>
      <div className="block">
        About page
      </div>
      <Link to="/">
        <div className="is-underlined has-text-white">
          Back
        </div>
      </Link>
    </>
  )
}