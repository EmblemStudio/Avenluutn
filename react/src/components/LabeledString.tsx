import React from 'react'
import { Link } from 'react-router-dom'

import { LabeledString } from '../../../scripts/src'

const entityLabels = ["guildName", "adventurerName"]

interface LabeledStringProps {
  labeledString: LabeledString;
  storyIndex: number;
}

export default ({ labeledString: { label, string, entityId }, storyIndex }: LabeledStringProps) => {
  if (entityLabels.includes(label) && entityId !== undefined) {
    let to = ""
    if (label === "guildName") to = `/${storyIndex}/lobby`
    if (label === "adventurerName") to = `/${storyIndex}/adventurers/${entityId}`
    return (
      <span className={`${label} is-underlined`}>
        <Link to={to}>
          {string}
        </Link>
      </span>
    )
  }
  return (
    <span className={label}>{string}</span>
  )
}