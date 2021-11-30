import React, { ReactElement } from 'react'

interface Expanders { [index: number]: boolean }

interface StoryExpanderProps {
  children: ReactElement;
  index: number;
  name: string;
  expanders: Expanders;
  setExpanders: Function;
}

export default ({children, index, name, expanders, setExpanders}: StoryExpanderProps) => {
  let expanded: boolean | undefined = expanders[index]

  function toggle() {
    const newExpanders: Expanders = {}
    if (expanded) {
      newExpanders[index] = false
    } else {
      newExpanders[index] = true
    }
    setExpanders(Object.assign({},
      expanders,
      newExpanders
    ))
    expanded = expanders[index]
  }

  return (
    <div>
      { expanded ?
        <>
          <a className="has-text-white is-size-4" onClick={toggle}>
            V <span className="is-garamond is-italic">{name}</span>
          </a>
          {children}
        </>
      :
        <>
          <a className="has-text-white is-size-4" onClick={toggle}>
            > <span className="is-garamond is-italic">{name}</span>
          </a>
        </>
      }
    </div>
  )
}