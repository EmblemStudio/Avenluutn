import React from 'react'

import { SHARE_PAYOUTS } from '../constants'
import { Share, Narrator, StoryCategory, Story, outcomeString, storyCategory } from '../utils'

interface ShareOutcomeProps { share: Share, story: Story, narrator: Narrator }

export default ({ share, story, narrator }: ShareOutcomeProps) => {
  const { outcome } = share
  const category = storyCategory(narrator, story)
  const payout = SHARE_PAYOUTS[outcome]
  let payoutText = ""
  let sign = "+"
  let exclamation = ""
  let color = "red"
  if (payout > 0) {
    exclamation = "!"
    color = "green"
    payoutText += `${sign}${payout} crin${exclamation}`
  }
  if (payout < 0) sign = "-"
  if (payout === undefined) color = "grey"
  return (
    <>
      <span className={`has-text-weight-bold has-text-${color}`}>
        {`${outcomeString(
          outcome,
          category === StoryCategory.onAuction || category === StoryCategory.completed
        )} `}
      </span>
      <span className="has-text-weight-bold has-text-yellow">{payoutText}</span>
    </>
  )
}