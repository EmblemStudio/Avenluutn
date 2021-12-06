import React from 'react'

import Countdown from './Countdown'
import { Story, storyName, getTimeLeft } from '../utils'
import { LOADING } from '../constants' 

interface StoryBoxProps { story: Story }

export default ({ story }: StoryBoxProps) => {
  return (
    <section className="section pt-2 pb-5">
      <div className="container outer-border">
        <div className="container inner-border">
          <section className="section pt-5 pb-5">
            <div className="block">
              {story.text.richText.beginning.map((b, i) => {
                return (
                  <span key={i}>
                    {b}
                    {" "}
                  </span>
                )
              })}
            </div>
            <div className="block">
              {story.text.richText.middle.obstacleText.map((o, i) => {
                return (
                  <div className="block" key={i}>
                    <div className="block">
                      {o}
                      {" "}
                      {story.text.richText.middle.outcomeText[i]?.main ?? "Unknown outcome"}
                    </div>
                    <div className="block">
                      {story.text.richText.middle.outcomeText[i]?.results.map((r, i) => {
                        return (
                          <div className="container has-text-grey" key={i}>
                            {r}
                          </div>
                        )
                      }) ?? "Unknown result"}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="block">
              {story.text.richText.ending}
            </div>
            {getTimeLeft(Number(story.endTime)) > 0 &&
              <div className="has-text-centered">
                <div className="block">
                  {LOADING}
                </div>
                <div className="block">
                  <Countdown to={Number(story.endTime)}/>
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