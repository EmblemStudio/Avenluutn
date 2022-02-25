import React from 'react'
import { Link } from 'react-router-dom'

import Countdown from './Countdown'
import { Story, storyName, getTimeLeft } from '../utils'
import { WAITING_FOR_SERVER } from '../constants'
import LoadingAnimation from './LoadingAnimation'
import useNarratorState from '../hooks/useNarratorState';

interface StoryBoxProps { story: Story }

const entityLabels = ["guildName", "adventurerName"]

export default ({ story }: StoryBoxProps) => {
  const narratorState = useNarratorState()
  function label({ label, string, entityId }: { label: string, string: string, entityId?: number }, key: number) {
    if (entityLabels.includes(label) && entityId !== undefined) {
      let to = ""
      if (label = "guildName") to = `/${story.storyIndex}/lobby`
      if (label = "adventurerName") to = `/${story.storyIndex}/adventurers/${entityId}`
      return (
        <span key={key} className={`${label} is-underlined`}>
          <Link to={to}>
            {string}
          </Link>
        </span>
      )
    }
    return (
      <span key={key} className={label}>{string}</span>
    )
  }

  console.log("rendering StoryBox", story)
  console.log("story end time", new Date(story.endTime.toNumber() * 1000).toLocaleString())

  return (
    <section className="section pt-2 pb-4">
      <div className="container outer-border">
        <div className="container inner-border">
          <section className="section pt-5 pb-5">
            <div className="block beginning">
              {story.text.richText.beginning.map(label)}
            </div>
            <div className="block middle">
              {story.text.richText.middle.obstacleText?.map((obText, i) => {
                return (
                  <div className="block middle obstacle" key={i}>
                    <div className="block outcome main">
                      {obText?.map(label)}
                    </div>
                    <div className="block outcome main">
                      {story.text.richText.middle.outcomeText[i]?.main?.map(label)}
                    </div>
                    <div className="block outcome triggers">
                      {story.text.richText.middle.outcomeText[i]?.triggerTexts?.map((t, i) => {
                        return <div key={i}>{t.map(label)}</div>
                      })}
                    </div>
                    <div className="block outcome results">
                      {story.text.richText.middle.outcomeText[i]?.resultTexts?.map((r, i) => {
                        return <div key={i}>{r.map(label)}</div>
                      })}
                    </div>
                  </div>
                )
              }) ?? "no obstacle text found"}
            </div>
            <div className="block ending">
              <div className="block ending main">
                {story.text.richText.ending.main?.map(label) ?? story.text.richText.ending.main?.map(label)}
              </div>
              <div className="block ending results">
                {story.text.richText.ending.resultTexts?.map(label)}
              </div>
            </div>
            {story.text.nextUpdateTime !== -1 &&
              <div className="block">
                <LoadingAnimation />
              </div>
            }
            {getTimeLeft(story.text.nextUpdateTime) > 0 ?
              <div className="block">
                <Countdown
                  to={story.text.nextUpdateTime}
                />
              </div>
              :
              story.text.nextUpdateTime !== -1 &&
              <div className="block has-text-grey">
                {narratorState.queryUntilUpdate(narratorState)}
                {WAITING_FOR_SERVER}
              </div>
            }
          </section>
        </div>
      </div>
      <div className="container has-text-right is-garamond is-italic is-size-5 pr-1">
        {`NFT ${storyName(story)}`}
      </div>
    </section>
  )
}
