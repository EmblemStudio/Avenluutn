import React from 'react'

import Countdown from './Countdown'
import { Story, storyName, getTimeLeft } from '../utils'
import { LOADING } from '../constants' 

interface StoryBoxProps { story: Story }


function label(text: { label: string, string: string }, key: number) {
  return (
    <span key={key} className={text.label}>{text.string}</span>
  )
}

export default ({ story }: StoryBoxProps) => {
  
  return (
    <section className="section pt-2 pb-5">
      <div className="container outer-border">
        <div className="container inner-border">
          <section className="section pt-5 pb-5">
            <div className="block beginning">
             {story.text.richText.beginning.map(label)}
            </div>
            <div className="block middle">
              {story.text.richText.middle.obstacleText.map((obText, i) => {
                return (
                  <div className="block middle obstacle" key={i}>
                    <div className="block outcome main">
                      <div>
                        {obText.map(label)}
                      </div>
                      <div>
                        {story.text.richText.middle.outcomeText[i]?.main.map(label)}
                      </div>
                    </div>
                    <div className="block outcome triggers">
                      {story.text.richText.middle.outcomeText[i]?.triggerTexts.map((t, i) => {
                        return <div key={i}>{t.map(label)}</div>
                      })}
                    </div>
                    <div className="block outcome results">
                      {story.text.richText.middle.outcomeText[i]?.resultTexts.map((r, i) => {
                        return <div key={i}>{r.map(label)}</div>
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="block">
              {story.text.richText.ending.map(label)}
            </div>
            {getTimeLeft(Number(story.endTime)) > 0 &&
              <div className="has-text-centered">
                <div className="block">
                  {LOADING}
                </div>
                <div className="block">
                  <Countdown to={story.text.nextUpdateTime}/>
                </div>
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
