import React from "react"
import { Link } from "react-router-dom"

export default () => {
  return (
    <div className="level m-3">
      <div className="level-item">
        <Link to="/embassy/chamber">
          <div className={`guild-button outer-border has-text-white`}>
            <div className={`container has-text-centered inner-border has-text-white pt-3 pb-3`}>
              <div className="block">
                Embassy
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}