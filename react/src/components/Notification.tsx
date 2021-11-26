import React from 'react'

export default (text: string, color: string, key: number, close: React.MouseEventHandler) => {
  return (
    <div className={`notification has-text-${color}`} key={key}>
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            {text}
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <a 
              className="close has-text-black" 
              onClick={close}
            >X</a>
          </div>
        </div>
      </nav>
    </div>
  )
}