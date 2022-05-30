import React from "react"
import { Contract } from '@ethersproject/contracts'

import { NarratorState, Narrator, NotificationFunction, Story, StoriesByGuild, CategorizedVotes, Vote } from '../utils'
import StoryBox from "./StoryBox"
import VoteBox from "./VoteBox"
import StoryAuction from "./StoryAuction"
import JoinTheDiscord from './JoinTheDiscord'
import LoadingAnimation from "./LoadingAnimation"
import LabeledString from "./LabeledString"
import useVotes from "../hooks/useVotes"
import { Label, LabeledString as LS } from "../../../scripts/src"
import { chapterNotifications } from "../chapterNotifications"

interface UrgentMatterProps {
  publisher: Contract | string;
  narratorState: NarratorState;
  addNotification: NotificationFunction;
  removeNotification: NotificationFunction;
}

export default ({ publisher, narratorState, addNotification, removeNotification }: UrgentMatterProps) => {
  const { data: votes } = useVotes()

  if (narratorState === undefined) {
    return (
      <div className="dotted-bookends">
        <div className="p-3">
          <div className="block is-garamond is-italic is-size-4 mb-1">
            Urgent!
          </div>
          <LoadingAnimation />
        </div>
      </div>
    )
  }

  const um = findUrgentMatter(narratorState.narrator, votes)

  return (
    <div className="dotted-bookends">
      <div className="p-3">
        {um.type !== MatterType.lounge &&
          <div className="block is-garamond is-italic is-size-4 mb-1">
            Urgent!
          </div>
        }
        {narratorState.loadState === "finished" ?
          urgentMatterContent(um, publisher, narratorState, addNotification, removeNotification)
          :
          <LoadingAnimation />
        }
      </div>
    </div>
  )
}

function urgentMatterContent(
  um: UrgentMatter,
  publisher: Contract | string,
  narratorState: NarratorState,
  addNotification: NotificationFunction,
  removeNotification: NotificationFunction
) {
  if (um.matter !== undefined) {
    switch (um.type) {
      case MatterType.notifications:
        return (
          <div className="block">
            {(um.matter as LS[][][]).map((lsaa, i) => {
              return (
                <div className="block" key={i}>
                  {lsaa.map((lsa, i) => {
                    let storyIndex = 0
                    lsa.forEach(ls => {
                      if (ls.label === Label.guildName && ls.entityId !== undefined)
                        storyIndex = ls.entityId
                    })
                    return (
                      <div key={i}>
                        {lsa.map((ls, i) => <LabeledString key={i} labeledString={ls} storyIndex={storyIndex} />)}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      case MatterType.upcomingVote:
        return (
          <VoteBox vote={um.matter as Vote} />
        )
      case MatterType.inProgressVote:
        return (
          <VoteBox vote={um.matter as Vote} />
        )
      case MatterType.inProgressStory:
        return (
          <StoryBox
            story={um.matter as Story}
            narratorState={narratorState}
          />
        )
      case MatterType.onAuctionStory:
        return (
          <StoryAuction
            story={um.matter as Story}
            addNotification={addNotification}
            removeNotification={removeNotification}
            publisher={publisher}
            narratorState={narratorState}
          />
        )
      default:
        break
    }
  }
  return (
    <div>
      <div className="block">
        All tales are told and votes are tallied.
      </div>
      <JoinTheDiscord />
    </div>
  )
}

enum MatterType {
  "notifications",
  "upcomingVote",
  "inProgressVote",
  "inProgressStory",
  "onAuctionStory",
  "lounge"
}

interface UrgentMatter {
  type: MatterType;
  voteIndex?: number;
  matter?: LS[][][] | Story | Vote
}


/*
 * Spec
 * The "Urgent Matter" box should show a single interesting "thing to do" for users, 
 * drawing from these sources in order of priority:
 * 1a. votes in progress
 * 1b. upcoming votees
 * 2. stories in progress
 * 3. stories on auction
 * 4. chapter notifications
 * 5. joining the discord in the Embassy lounge
 */

function findUrgentMatter(narrator: Narrator, votes?: CategorizedVotes): UrgentMatter {
  let um: UrgentMatter = {
    type: MatterType.inProgressVote
  }
  if (votes !== undefined) {
    if (votes.inProgress.length > 0) {
      const r = votes.inProgress[0]
      um.matter = r
      um.voteIndex = 0
    } else if (votes.upcoming.length > 0) {
      um.type = MatterType.upcomingVote
      const r = votes.upcoming[0]
      um.matter = r
      um.voteIndex = 0
    }
  } else {
    let storyId: string | undefined
    const randomInProgress = randomStory(narrator.storiesByGuild, "inProgress")
    const randomOnAuction = randomStory(narrator.storiesByGuild, "onAuction")
    if (randomInProgress !== undefined) {
      storyId = randomInProgress
      um.type = MatterType.inProgressStory
    } else if (randomOnAuction !== undefined) {
      storyId = randomOnAuction
      um.type = MatterType.onAuctionStory
    }
    if (storyId !== undefined) {
      const story = narrator.stories[storyId]
      if (story !== undefined) {
        um.matter = story
      }
    }
  }
  if (chapterNotifications.length > 0) {
    um.type = MatterType.notifications
    um.matter = chapterNotifications
  }
  if (um.matter === undefined) {
    um.type = MatterType.lounge
  }
  return um
}

function randomItem<T>(array: T[]): [T | undefined, number] {
  const i = Math.floor(Date.now() / 10000) % array.length
  return [array[i], i]
}

function randomStory(stories: StoriesByGuild, type: "inProgress" | "onAuction" | "completed"): string | undefined {
  const randomGuild = stories[Math.floor(Date.now() / 10000) % Object.keys(stories).length]
  if (randomGuild === undefined) return
  return randomItem<string>(randomGuild[type])[0]
}