import React from 'react'
import { Link } from 'react-router-dom'

import { LabeledString } from '../../../scripts/src'
import { coloredBoldStyle, guildColor } from '../utils'

const entityLabels = ["guildName", "adventurerName"]

interface LabeledStringProps {
  labeledString: LabeledString;
  storyIndex: number;
}

export default ({ labeledString: { label, string, entityId }, storyIndex }: LabeledStringProps) => {
  if (entityLabels.includes(label) && entityId !== undefined) {
    let to = ""
    let style = ""
    if (label === "guildName") {
      to = `/${storyIndex}/lobby`
      style = coloredBoldStyle(guildColor(storyIndex))
    }
    if (label === "adventurerName") to = `/${storyIndex}/adventurers/${entityId}`
    return (
      <Link to={to}>
        <span className={`${label} ${style}`}>
          {string}
        </span>
      </Link>
    )
  }
  return (
    <span className={label}>{string}</span>
  )
}