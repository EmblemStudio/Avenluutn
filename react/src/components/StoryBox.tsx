import React from 'react'

import { Story } from '../utils'

export default (story: Story) => {
  return (
    <section className="section pt-3 pb-5" key={story.collectionIndex}>
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
                      {story.text.richText.middle.outcomeText[i].main}
                    </div>
                    <div className="block">
                      {story.text.richText.middle.outcomeText[i].results.map((r, i) => {
                        return (
                          <div className="container has-text-grey" key={i}>
                            {r}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="block">
              {story.text.richText.ending}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}