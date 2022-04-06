import React from "react"
import { Contract } from '@ethersproject/contracts'

import { NarratorState, Narrator, NotificationFunction, Story, StoriesByGuild, CategorizedVotes, Vote } from '../utils'
import StoryBox from "./StoryBox"
import VoteBox from "./VoteBox"
import StoryAuction from "./StoryAuction"
import JoinTheDiscord from './JoinTheDiscord'
import LoadingAnimation from "./LoadingAnimation"
import useVotes from "../hooks/useVotes"

interface UrgentMatterProps {
  publisher: Contract | string;
  narratorState: NarratorState;
  addNotification: NotificationFunction;
  removeNotification: NotificationFunction;
}

export default ({ publisher, narratorState, addNotification, removeNotification }: UrgentMatterProps) => {
  const { data: votes } = useVotes()
  const um = findUrgentMatter(narratorState.narrator, votes)

  return (
    <div className="dotted-bookends">
      <div className="p-3">
        <div className="block is-garamond is-italic is-size-4 mb-1">
          Urgent!
        </div>
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
  "upcomingVote",
  "inProgressVote",
  "inProgressStory",
  "onAuctionStory",
  "lounge"
}

interface UrgentMatter {
  type: MatterType;
  voteIndex?: number;
  matter?: Story | Vote
}


/*
 * Spec
 * The "Urgent Matter" box should show a single interesting "thing to do" for users, 
 * drawing from these sources in order of priority:
 * 1a. votes in progress
 * 1b. upcoming votees
 * 2. stories in progress
 * 3. stories on auction
 * 3. Joining the discord in the Embassy lounge
 */

function findUrgentMatter(narrator: Narrator, votes?: CategorizedVotes): UrgentMatter {
  let um: UrgentMatter = {
    type: MatterType.inProgressVote
  }
  if (votes !== undefined) {
    if (votes.inProgress.length > 0) {
      const r = randomItem<Vote>(votes.inProgress)
      um.matter = r[0]
      um.voteIndex = r[1]
    } else if (votes.upcoming.length > 0) {
      um.type = MatterType.upcomingVote
      const r = randomItem<Vote>(votes.upcoming)
      um.matter = r[0]
      um.voteIndex = r[1]
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
  if (um === undefined) {
    um = {
      type: MatterType.lounge
    }
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