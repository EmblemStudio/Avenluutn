import React from "react"

import EmbassyHeader from "../components/EmbassyHeader"

export default () => {
  return (
    <>
      <EmbassyHeader selected="logbook" />
      <div className="p-4">
        <div className="block">
          The embassy logbook records historical proposals.
        </div>
        <div className="block">
          Notes in the native tongues of many emissaries are scrawled in the margins.
        </div>
      </div>
    </>
  )
}