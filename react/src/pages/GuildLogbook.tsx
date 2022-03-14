import React from 'react'
import { AddressZero } from '@ethersproject/constants'
import { useAccount } from 'wagmi'

import ConnectButton from '../components/ConnectButton'
import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import useNotifications from '../hooks/useNotifications'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useGuild from '../hooks/useGuild'
import { NARRATOR_PARAMS } from '../constants'
import { coloredBoldStyle, storyId, Story } from '../utils'
import Expander from '../components/Expander'

export default () => {
  const narratorState = useNarratorState()
  const { narrator } = narratorState
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
            . It records deeds past.
          </div>
          {[...narrator.storiesByGuild[guild.id].onAuction, ...narrator.storiesByGuild[guild.id].completed].length === 0 ?
            <div className="block">
              The pages are blank.
            </div>
            :
            <div className="block">
              <div className="block">
                Connect through the ether to sponsor a tale:
              </div>
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <ConnectButton />
                  </div>
                </div>
              </div>
              {narrator.storiesByGuild[guild.id].onAuction.map((id, i) => {
                const s = narrator.stories[id]
                if (s === undefined) return <div key={i}></div>
                return (
                  <Expander key={i} text={`${storyId(s)} 🔥`}>
                    <StoryAuction
                      story={s}
                      publisher={publisher}
                      narratorState={narratorState}
                      addNotification={addNotification}
                      removeNotification={removeNotification}
                    />
                  </Expander>
                )
              })}
              {narrator.storiesByGuild[guild.id].completed.map((id, i) => {
                const s = narrator.stories[id]
                if (s === undefined) return <div key={i}></div>
                isClaimable(s) ? emoji = "✨" : emoji = ""
                return (
                  <Expander key={i} text={`${storyId(s)} ${emoji}`}>
                    <StoryAuction
                      story={s}
                      publisher={publisher}
                      narratorState={narratorState}
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