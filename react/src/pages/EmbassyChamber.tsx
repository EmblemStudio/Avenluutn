import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"

export default () => {
  return (
    <>
      <EmbassyHeader selected="chamber" />
      <div className="p-4">
        <div className="block">
          Emissaries debate the proposals on hand.
          If decreed, they will take effect in future adventuring seasons.
        </div>
      </div>
    </>
  )
}