import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"
import JoinTheDiscord from "../components/JoinTheDiscord"

export default () => {
  return (
    <>
      <EmbassyHeader selected="lounge" />
      <div className="p-4">
        <div className="block">
          Emissaries make merry, collude, and speculate
          on the secrets of the waste beyond the town boundary.
        </div>
        <JoinTheDiscord />
      </div>
    </>
  )
}