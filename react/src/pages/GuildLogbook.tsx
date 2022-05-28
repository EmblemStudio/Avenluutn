import React, { useEffect, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { useAccount } from 'wagmi'

import ConnectButton from '../components/ConnectButton'
import GuildHeader from '../components/GuildHeader'
import StoryAuction from '../components/StoryAuction'
import useNotifications from '../hooks/useNotifications'
import useNarratorState from '../hooks/useNarratorState'
import usePublisher from '../hooks/usePublisher'
import useGuild from '../hooks/useGuild'
import { NARRATOR_PARAMS } from '../constants'
import { coloredBoldStyle, storyId, Story, firstArrayElement, NarratorState, NotificationFunction } from '../utils'
import Expander from '../components/Expander'
import LoadingAnimation from '../components/LoadingAnimation'

export default () => {
  const narratorStateObjects = useNarratorState()
  const narratorState = firstArrayElement(narratorStateObjects).state
  const { narrator } = narratorState
  const publisher = usePublisher(NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)
  const { addNotification, removeNotification } = useNotifications()
  const [{ data }] = useAccount()
  const [blank, setBlank] = useState<boolean>(true)

  useEffect(() => {
    narratorStateObjects.forEach(nso => {
      Object.keys(nso.state.narrator.storiesByGuild).forEach(k => {
        const stories = nso.state.narrator.storiesByGuild[parseInt(k)]
        if (stories !== undefined) {
          if ([...stories.onAuction, ...stories.completed].length > 0) setBlank(false)
        }
      })
    })
  }, [narratorStateObjects])

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
          {blank ?
            <div className="block">
              The pages are blank.
            </div>
            :
            <div className="block">
              <div className="block">
                Will you add your seal to an entry and lend the guild support?
                Connect through the ether to bid or claim:
              </div>
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <ConnectButton />
                  </div>
                </div>
              </div>
              {narratorStateObjects.map((nso, i) => {
                if (nso.state.loadState === "finished") {
                  if (nso.state.narrator.storiesByGuild[guild.id] === undefined ||
                    nso.state.narrator.storiesByGuild[guild.id]?.completed.length === 0)
                    return <div key={i}></div>
                  return <Expander key={i} text={`Chapter ${nso.contractIndex}`}>
                    <LogbookChapter
                      narratorState={nso.state}
                      guildId={guild.id}
                      publisher={publisher}
                      addNotification={addNotification}
                      removeNotification={removeNotification}
                      accountAddress={data?.address}
                    />
                  </Expander>
                } else {
                  return <div className="block" key={i}><LoadingAnimation /></div>
                }
              })}
            </div>
          }
        </div>
      }
    </>
  )
}

function isClaimable(s: Story, accountAddress?: string): boolean {
  if (s.minted === false) {
    // if (typeof publisher === "string") return false
    if (s.auction.bidder === AddressZero) return true
    if (s.auction.bidder === accountAddress) return true
  }
  return false
}

interface LogbookChapterProps {
  narratorState: NarratorState;
  guildId: number;
  publisher: string | Contract;
  addNotification: NotificationFunction;
  removeNotification: NotificationFunction;
  accountAddress: string | undefined;
}

function LogbookChapter({
  narratorState,
  guildId,
  publisher,
  addNotification,
  removeNotification,
  accountAddress
}: LogbookChapterProps) {
  const narrator = narratorState.narrator
  let emoji = ""
  return (
    <>
      {narrator.storiesByGuild[guildId].onAuction.map((id, i) => {
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
      {narrator.storiesByGuild[guildId].completed.map((id, i) => {
        const s = narrator.stories[id]
        if (s === undefined) return <div key={i}></div>
        isClaimable(s, accountAddress) ? emoji = "✨" : emoji = ""
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
    </>
  )
}