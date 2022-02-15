import React, { useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { useAccount } from 'wagmi'

import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import useNotifications from '../hooks/useNotifications'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useGuild from '../hooks/useGuild'
import { NARRATOR_PARAMS } from '../constants'
import { coloredBoldStyle, storyName, Story } from '../utils'
import Expander from '../components/Expander'

export default () => {
  const { narrator, updateNarrator } = useNarratorState()
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)
  const { addNotification, removeNotification } = useNotifications()
  const [{ data }] = useAccount()

  function isClaimable(s: Story): boolean {
    if (s.minted === false) {
      // if (typeof publisher === "string") return false
      if (s.auction.bidder === AddressZero) return true
      if (s.auction.bidder === data?.address) return true
    }
    return false
  }

  let emoji = ""

  return (
    <>
      <GuildHeader guild={guild} selected="logbook" />
      {guild &&
        <div className="block p-4">
          <div className="block">
            {"The logbook is engraved with the guild motto: "}
            <span className={coloredBoldStyle(color ?? null)}>
              “{guild.motto}”
            </span>
            . It records deeds past:
          </div>
          {[...narrator.stories[guild.id].onAuction, ...narrator.stories[guild.id].completed].length === 0 ?
            <div className="block">
              "The pages are blank."
            </div>
            :
            <div className="block">
              {narrator.stories[guild.id].onAuction.map(s => {
                return (
                  <Expander key={s.collectionIndex} text={`${storyName(s)} 🔥`}>
                    <StoryAuction
                      story={s}
                      publisher={publisher}
                      updateNarrator={updateNarrator}
                      addNotification={addNotification}
                      removeNotification={removeNotification}
                    />
                  </Expander>
                )
              })}
              {narrator.stories[guild.id].completed.map(s => {
                isClaimable(s) ? emoji = "✨" : emoji = ""
                return (
                  <Expander key={s.collectionIndex} text={`${storyName(s)} ${emoji}`}>
                    <StoryAuction
                      story={s}
                      publisher={publisher}
                      updateNarrator={updateNarrator}
                      addNotification={addNotification}
                      removeNotification={removeNotification}
                    />
                  </Expander>
                )
              })}
            </div>
          }
        </div>
      }
    </>
  )
}