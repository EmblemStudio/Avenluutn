import React from 'react'

import AccountHeader from '../components/AccountHeader'
import useUser from '../hooks/useUser'
import useNarratorState from '../hooks/useNarratorState'
import { CURRENCY } from '../constants'
import { Share } from '../utils'

function outcomeString(outcome: string): string {
  if (outcome === "GreatSuccess") { return "Great Success" }
  if (outcome === "Success" || outcome === "Failure") { return outcome }
  return "Unknown Outcome"
}

export default () => {
  const narratorState = useNarratorState()
  const { user } = useUser()
  return (
    <>
      <AccountHeader />
      <div>
        {Object.keys(user.shares).map((key) => {
          const share: Share = user.shares[key]
          if (share !== undefined) {
            const { size, storyIndex, outcome } = share
            const recentCollection = narratorState.narrator.collections[narratorState.narrator.collections.length - 1]
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
