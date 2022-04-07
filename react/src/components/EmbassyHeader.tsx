import React from 'react'
import { Link } from 'react-router-dom'

import EmbassyButton from './EmbassyButton'
import { coloredBoldStyle } from '../utils'
import LoadingAnimation from './LoadingAnimation'

const padding = "pl-3 pr-3"

function selectedStyles(selected: string, rendered: string): string {
  if (selected === rendered) {
    return coloredBoldStyle("white")
  }
  return " has-text-white"
}

interface EmbassyHeaderProps {
  selected: string
}

export default ({ selected }: EmbassyHeaderProps) => {
  if (!true) return (
    <nav className="level">
      <div className="level-left">
        <div className={`level-item ${padding} mt-5`}>
          <LoadingAnimation />
        </div>
      </div>
    </nav>
  )

  return (
    <nav className="level">
      <div className="level-left">
        <EmbassyButton />
        <div className={`level-item ${padding}`}>
          <Link to={`/embassy/chamber`}>
            <div className={"is-underlined" + selectedStyles(selected, "chamber")}>
              Governing Chamber
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/embassy/lounge`}>
            <div className={"is-underlined" + selectedStyles(selected, "lounge")}>
              Lounge
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to={`/embassy/logbook`}>
            <div className={"is-underlined" + selectedStyles(selected, "logbook")}>
              Logbook
            </div>
          </Link>
        </div>
        <div className={`level-item ${padding}`}>
          <Link to="/">
            <div className="is-underlined has-text-white">
              Back
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}