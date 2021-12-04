import React from 'react'

interface NotificationProps {
  text: string,
  color: string,
  close: React.MouseEventHandler
}

export default ({ text, color, close }: NotificationProps) => {
  return (
    <div className={`notification is-fixed has-text-${color}`}>
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