import React from 'react'

interface AdventurerHeaderProps {
  name: string;
  class_: string;
  graveyard: boolean;
}

export default ({ name, class_, graveyard }: AdventurerHeaderProps) => {
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
              <div className="block is-italic">
                dec. 1.3.5
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}