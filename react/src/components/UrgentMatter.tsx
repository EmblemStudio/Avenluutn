import React from "react"
import { Contract } from '@ethersproject/contracts'

import { NarratorState, Narrator, NotificationFunction, Story, StoriesByGuild } from '../utils'
import StoryBox from "./StoryBox"
import StoryAuction from "./StoryAuction"
import JoinTheDiscord from './JoinTheDiscord'
import LoadingAnimation from "./LoadingAnimation"

/*
 * Spec
 * The "Urgent Matter" box should show a single interesting "thing to do" for users, 
 * drawing from these sources in order of priority:
 * 1. Votes
 * 2. stories in progress
 * 3. stories on auction
 * 3. Joining the discord in the Embassy lounge
 */

interface UrgentMatterProps {
  publisher: Contract | string;
  narratorState: NarratorState;
  addNotification: NotificationFunction;
  removeNotification: NotificationFunction;
}

export default ({ publisher, narratorState, addNotification, removeNotification }: UrgentMatterProps) => {
  const um = findUrgentMatter(narratorState.narrator)

  return (
    <div className="dotted-bookends">
      <div className="p-6">
        <div className="block is-garamond is-italic is-size-4">
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
  switch (um.type) {
    case MatterType.vote:

    case MatterType.inProgress:
      if (um.matter !== undefined) {
        return (
          <StoryBox
            story={um.matter}
            narratorState={narratorState}
          />
        )

      }
    case MatterType.onAuction:
      if (um.matter !== undefined) {
        return (
          <StoryAuction
            story={um.matter}
            addNotification={addNotification}
            removeNotification={removeNotification}
            publisher={publisher}
            narratorState={narratorState}
          />
        )
      }
    default:
      return (
        <div>
          <div className="block">
            All tales are told and votes are tallied.
          </div>
          <JoinTheDiscord />
        </div>
      )
  }
}

enum MatterType {
  "vote",
  "inProgress",
  "onAuction",
  "lounge"
}

interface UrgentMatter {
  type: MatterType;
  matter?: Story // | Vote
}

function findUrgentMatter(narrator: Narrator): UrgentMatter {
  let um: UrgentMatter = {
    type: MatterType.vote
  }
  let storyId: string | undefined
  const randomInProgress = randomStory(narrator.storiesByGuild, "inProgress")
  const randomOnAuction = randomStory(narrator.storiesByGuild, "onAuction")
  if (randomInProgress !== undefined) {
    storyId = randomInProgress
    um.type = MatterType.inProgress
  } else if (randomOnAuction !== undefined) {
    storyId = randomOnAuction
    um.type = MatterType.onAuction
  }
  if (storyId !== undefined) {
    const story = narrator.stories[storyId]
    if (story !== undefined) {
      um.matter = story
    }
  }
  if (um === undefined) {
    um = {
      type: MatterType.lounge
    }
  }
  return um
}

function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Date.now() / 10000) % array.length]
}

function randomStory(stories: StoriesByGuild, type: "inProgress" | "onAuction" | "completed"): string | undefined {
  const randomGuild = stories[Math.floor(Date.now() / 10000) % Object.keys(stories).length]
  if (randomGuild === undefined) return
  return randomItem<string>(randomGuild[type])
}