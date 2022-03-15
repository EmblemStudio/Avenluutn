import React from 'react'
import { Link } from 'react-router-dom'

import { Story, storyId } from '../utils'

interface AdventurerHeaderProps {
  name: string;
  class_: string;
  graveyard: boolean;
  lastStory?: Story;
}

export default ({ name, class_, graveyard, lastStory }: AdventurerHeaderProps) => {
  if (!graveyard) return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item m-3">
          <div className="guild-button outer-border">
            <div className="container has-text-centered inner-border pt-3 pb-3">
              <div className="block">
                {name}, {class_}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )

  return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item m-3">
          <div className="guild-button outer-border">
            <div className="container has-text-centered inner-border pt-3 pb-3">
              <div className="block">
                {name}, {class_}
              </div>
              <div className="block is-garamond is-size-4">
                R I P
              </div>
              {lastStory !== undefined &&
                <div className="block is-italic">
                  dec.
                  <Link to={`/${lastStory.storyIndex}/stories/${lastStory.collectionIndex}`}>
                    <span className="has-text-white is-underlined">{storyId(lastStory)}</span>
                  </Link>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}