import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"
import VoteBox from "../components/VoteBox"
import useVotes from "../hooks/useVotes"
import { Vote } from "../utils"

export default () => {
  const { data: votes } = useVotes()

  return (
    <>
      <EmbassyHeader selected="chamber" />
      <div className="p-4">
        <div className="block">
          Emissaries debate the proposals on hand.
          If decreed, they will take effect in future adventuring seasons.
        </div>
        <div className="block">
          {votes?.inProgress.map((v, i) => <VoteBox vote={v} key={i} />)}
        </div>
      </div>
    </>
  )
}