import React from "react"

import { twitterVoteLink } from "../utils/twitterVoteLink"

export interface VoteButtonProps {
  buttonText: string;
  matchText: string;
  color: string;
  disabled?: boolean;
}

export default ({ buttonText, matchText, color, disabled }: VoteButtonProps) => {
  if (disabled === true) {
    return (
      <div className="level m-3">
        <div className="level-item">
          <div className={`vote-button-disabled outer-border has-border-${color}`}>
            <div className={`container has-text-centered inner-border has-border-${color} has-text-${color} pt-3 pb-3`}>
              <div className="block">
                {buttonText}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="level m-3">
      <div className="level-item">
        <a href={twitterVoteLink(matchText, buttonText, window.location.href)} target="_blank">
          <div className={`vote-button outer-border has-border-${color}`}>
            <div className={`container has-text-centered inner-border has-border-${color} has-text-${color} pt-3 pb-3`}>
              <div className="block">
                {buttonText}
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}