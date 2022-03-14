import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import useNarratorState from '../hooks/useNarratorState'
import useAdventurer from '../hooks/useAdventurer'
import { storyId, outcomeString, storyCategory, StoryCategory, Story } from '../utils'
import LoadingAnimation from '../components/LoadingAnimation'
import { nameString } from '../../../scripts/src/content/loot'
import AdventurerHeader from '../components/AdventurerHeader'
import Expander from '../components/Expander'

function capFirstLetter(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1)
}

interface AdventurerParams {
  graveyard: boolean;
}

export default ({ graveyard }: AdventurerParams) => {
  const { narrator } = useNarratorState()
  const { adventurer, guild, color } = useAdventurer(narrator, graveyard)
  const [stories, setStories] = useState<Story[]>([])
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const stories: Story[] = []
    for (const id in narrator.stories) {
      const story = narrator.stories[id]
      let includesAdv = false
      story?.text.party.forEach(adv => {
        if (adv.id === adventurer?.id) includesAdv = true
      })
      if (includesAdv) stories.push(story)
    }
    setStories(stories)
  }, [narrator, adventurer])

  // redirect if we've linked to an adventurer who is now dead or vice versa
  useEffect(() => {
    if (guild !== null) {
      const newPathArr = pathname.split("/")
      if (
        graveyard === false &&
        adventurer === null
      ) {
        newPathArr[2] = "graveyard"
        navigate(newPathArr.join("/"))
      } else if (
        graveyard === true &&
        adventurer === null
      ) {
        newPathArr[2] = "adventurers"
        navigate(newPathArr.join("/"))
      }
    }
  }, [narrator, adventurer, guild])

  if (adventurer === null || guild == null) return (
    <nav className="level">
      <div className="level-left">
        <div className={`level-item pl-3 pr-3 mt-5`}>
          <LoadingAnimation />
        </div>
      </div>
    </nav>
  )

  return (
    <>
      <AdventurerHeader
        name={nameString(adventurer.name)}
        class_={adventurer.class.join("")}
        graveyard={graveyard}
        lastStory={[...stories].pop()}
      />
      <div className="block p-4">
        <div>
          {"Pronouns: "}
          {adventurer.pronouns.subject}/{adventurer.pronouns.object}
        </div>
        <div>
          {"Species: "}
          {adventurer.species}
        </div>
        <div>
          {"Age: "}
          {adventurer.age}
        </div>
        <div>
          {"Guild: "}
          <Link to={`/${guild.id}/lobby`}>
            <span className={`is-underlined has-text-${color ?? "white"}`}>
              {guild.name}
            </span>
          </Link>
        </div>
      </div>
      <div className="block p-4">
        <Expander text="Stats">
          <>
            {Object.keys(adventurer.stats).map((s, i) => {
              return (
                <div key={i}>
                  {`${capFirstLetter(s)}: ${adventurer.stats[s]}`}
                </div>
              )
            })}
          </>
        </Expander>
        {adventurer.loot.length > 0 &&
          <Expander text="Loot">
            <>
              {adventurer.loot.map((l, i) => {
                return (
                  <div key={i}>
                    {l}
                  </div>
                )
              })}
            </>
          </Expander>
        }
        {adventurer.traits.length > 0 &&
          <Expander text="Traits">
            <>
              {adventurer.traits.map((t, i) => {
                return (
                  <div key={i}>
                    {capFirstLetter(t)}
                  </div>
                )
              })}
            </>
          </Expander>
        }
        {adventurer.skills.length > 0 &&
          <Expander text="Skills">
            <>
              {adventurer.skills.map((s, i) => {
                return (
                  <div key={i}>
                    {s}
                  </div>
                )
              })}
            </>
          </Expander>
        }
        {stories.length > 0 &&
          <Expander text="Stories">
            <>
              {stories.map((story, i) => {
                const category = storyCategory(narrator, story)
                return (
                  <div key={i}>
                    <Link to={`/${guild.id}/stories/${story.collectionIndex}`}>
                      <span className="has-text-white is-underlined">
                        {storyId(story)}
                      </span>
                    </Link>
                    {` – ${outcomeString(
                      story.text.finalOutcome,
                      category === StoryCategory.onAuction || category === StoryCategory.completed
                    )}`}
                  </div>
                )
              })}
            </>
          </Expander>
        }
      </div>
    </>
  )
}