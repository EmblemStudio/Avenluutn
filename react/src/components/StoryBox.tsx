import React from 'react'

import BuyShareButton from './BuyShareButton'
import Countdown, { CountdownDisplayMode } from './Countdown'
import LabeledString from './LabeledString'
import { Story, storyId, NarratorState } from '../utils'
import LoadingAnimation from './LoadingAnimation'

interface StoryBoxProps { story: Story, narratorState: NarratorState }

export default ({ story, narratorState }: StoryBoxProps) => {
  return (
    <section className="section pt-2 pb-4">
      <div className="container outer-border">
        <div className="container inner-border">
          <section className="section pt-5 pb-5">
            <div className="block beginning">
              {story.text.richText.beginning.map((l, i) => {
                return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
              })}
            </div>
            <div className="block middle">
              {story.text.richText.middle.obstacleText?.map((obText, i) => {
                return (
                  <div className="block middle obstacle" key={i}>
                    <div className="block outcome main">
                      {obText?.map((l, i) => {
                        return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                      })}
                    </div>
                    <div className="block outcome main">
                      {story.text.richText.middle.outcomeText[i]?.main?.map((l, i) => {
                        return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                      })}
                    </div>
                    <div className="block outcome triggers">
                      {story.text.richText.middle.outcomeText[i]?.triggerTexts?.map((t, i) => {
                        return <div key={i}>{t.map((l, i) => {
                          return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                        })}</div>
                      })}
                    </div>
                    <div className="block outcome results">
                      {story.text.richText.middle.outcomeText[i]?.resultTexts?.map((r, i) => {
                        return <div key={i}>{r.map((l, i) => {
                          return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                        })}</div>
                      })}
                    </div>
                  </div>
                )
              }) ?? "no obstacle text found"}
            </div>
            <div className="block ending">
              <div className="block ending main">
                {story.text.richText.ending.main?.map((l, i) => {
                  return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                })}
              </div>
              <div className="block ending results">
                {story.text.richText.ending.resultTexts?.map((labeledStrings, i) => {
                  return <div key={i}>{labeledStrings.map((l, i) => {
                    return <LabeledString labeledString={l} storyIndex={story.storyIndex} key={i} />
                  })}</div>
                })}
              </div>
            </div>
            {story.text.nextUpdateTime !== -1 &&
              <div className="block">
                <LoadingAnimation />
              </div>
            }
            <div className="block">
              {story.text.nextUpdateTime !== -1 &&
                <Countdown
                  to={story.text.nextUpdateTime}
                  narratorState={narratorState}
                  collectionIndex={story.collectionIndex}
                  storyIndex={story.storyIndex}
                  displayMode={CountdownDisplayMode.waiting_for_server}
                />
              }
            </div>
          </section>
        </div>
      </div>
      <div className="container">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <BuyShareButton story={story} />
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <div className="is-garamond is-italic is-size-5 pr-1">
                {storyId(story)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
