import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"
import VoteBox from "../components/VoteBox"
import Expander from "../components/Expander"
import useVotes from "../hooks/useVotes"

export default () => {
  const { data: votes } = useVotes()
  return (
    <>
      <EmbassyHeader selected="logbook" />
      <div className="p-4">
        <div className="block">
          The embassy logbook records historical proposals.
        </div>
        <div className="block">
          {votes?.completed.map((v, i) => {
            return (
              <Expander text={v.summary} key={i}>
                <VoteBox vote={v} key={i} />
              </Expander>
            )
          })}
        </div>
      </div>
    </>
  )
}