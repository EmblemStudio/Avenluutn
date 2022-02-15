import React, { ReactElement, useState } from 'react'

interface ExpanderProps {
  children: ReactElement;
  text: string;
}

export default ({ children, text }: ExpanderProps) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  function toggle() {
    if (expanded) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }

  return (
    <div>
      {expanded ?
        <>
          <a className="has-text-white is-size-4" onClick={toggle}>
            {"V "}
            <span className="is-garamond is-italic">
              {text}
            </span>
          </a>
          <div className="block pt-2 pb-5 pl-5">
            {children}
          </div>
        </>
        :
        <>
          <a className="has-text-white is-size-4" onClick={toggle}>
            {"> "}
            <span className="is-garamond is-italic">
              {text}
            </span>
          </a>
        </>
      }
    </div>
  )
}