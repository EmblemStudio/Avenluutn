import React from "react"

import Countdown, { CountdownDisplayMode } from "../components/Countdown"
import VoteButton from "../components/VoteButton"
import { Vote, presentOrPast, secondsToTimeString, twitterSearchLink } from "../utils"

const voteColors = {
  0: "fadedGreen",
  1: "fadedRed",
  2: "fadedYellow",
  3: "fadedBlue"
}

export default ({ vote }: { vote: Vote }) => {
  let winningCount = 0
  let winningOption = ""
  for (const o in vote.voteCount) {
    if (vote.voteCount[o] > winningCount) {
      winningCount = vote.voteCount[o]
      winningOption = o
    }
  }
  const over = presentOrPast(vote.endTime)

  return (
    <section className="section pt-2 pb-4">
      <nav className="level mb-2 mt-3">
        <div className="level-left">
          <div className="level-item">
            <span className="pr-1">Time left: </span>
            {over ?
              <span className="has-text-grey">{secondsToTimeString(0)}</span>
              :
              <Countdown
                to={vote.endTime}
                displayMode={CountdownDisplayMode.zeroes}
              />
            }
          </div>
        </div>
      </nav>
      <div className="container outer-border">
        <div className="container inner-border">
          <section className="section pt-5 pb-5">
            <div className="block is-garamond is-italic is-size-4">
              {vote.summary}
            </div>
            <div className="block">
              {vote.description}
            </div>
            <div className="block">
              <div className="level">
                {vote.voteOptions.map((o, i) => {
                  return (
                    <div className="level-item" key={i}>
                      <VoteButton
                        buttonText={o}
                        matchText={vote.matchString}
                        color={voteColors[i % 3 as 0 | 1 | 2 | 3]}
                        disabled={over}
                      />
                      {winningOption === o &&
                        <div className="has-text-gold mt-1" style={{ position: "absolute", top: 204, lineHeight: 0.7 }}>
                          <div>^^^^^^^^^^^^^^^^^^^^^</div>
                          <div className="has-text-centered">
                            {over ? "Won" : "Winning"}
                          </div>
                        </div>
                      }
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="block">
              <a className="is-underlined" href={twitterSearchLink(vote.matchString)} target="_blank">
                See votes
              </a>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}