import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"
import VoteBox from "../components/VoteBox"
import Expander from "../components/Expander"
import { NARRATOR_INDICES, NETWORK } from "../constants"
import useVotes from "../hooks/useVotes"
import { CategorizedVotes, firstArrayElement } from "../utils"

export default () => {
  const { data: votes } = useVotes()
  // const votes: CategorizedVotes | undefined = data === undefined ? undefined : data[firstArrayElement(NARRATOR_INDICES[NETWORK])]

  return (
    <>
      <EmbassyHeader selected="logbook" />
      <div className="p-4">
        <div className="block">
          The embassy logbook records historical proposals.
        </div>
        <div className="block">
          {votes !== undefined &&
            NARRATOR_INDICES[NETWORK].map((n, i) => {
              const narratorVotes: CategorizedVotes | undefined = votes[n]
              if (narratorVotes?.completed.length > 0) return (
                <Expander text={`Chapter ${n}`} key={i}>
                  <div className="block">
                    {narratorVotes?.completed.map((v, i) => {
                      return (
                        <Expander text={v.summary} key={i}>
                          <VoteBox vote={v} key={i} />
                        </Expander>
                      )
                    })}
                  </div>
                </Expander>
              )
              return (<div key={i}></div>)
            })
          }
        </div>
      </div>
    </>
  )
}