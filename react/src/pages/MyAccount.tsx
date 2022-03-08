import React from 'react'

import AccountHeader from '../components/AccountHeader'
import useUser from '../hooks/useUser'
import useNarratorState from '../hooks/useNarratorState'
import { CURRENCY } from '../constants'
import { Share, updateUserFromNarrator } from '../utils'
import { Success } from '../../../scripts/src'

function outcomeString(outcome: Success): string {
  switch (outcome) {
    case Success.failure:
      return "Failure"
    case Success.mixed:
      return "Success"
    case Success.success:
      return "Great Success"
    default:
      return "Unknown Outcome"
  }
}

export default () => {
  const { user, setUser } = useUser()
  const { narrator } = useNarratorState()
  // updateUserFromNarrator(user, narrator, setUser)

  return (
    <>
      <AccountHeader />
      <div>
        {Object.keys(user.shares).map((key) => {
          const share: Share = user.shares[key]
          if (share !== undefined) {
            const { size, storyIndex, outcome } = share
            const recentCollection = narrator.collections[narrator.collections.length - 1]
            if (recentCollection !== undefined) {
              const guild = recentCollection.scriptResult.nextState.guilds[storyIndex]
              if (guild !== undefined) {
                return (
                  <div key={key}>
                    {size} {CURRENCY} on {guild.name} {outcomeString(outcome)}!
                  </div>
                )
              }
            }
          }
        })}
      </div>
    </>
  )
}
