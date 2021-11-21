import React, { ReactElement } from 'react'

import Header from './Header'
import Footer from './Footer'

export default (el: ReactElement) => {
  return (
    <> 
      <div id="top">
        <Header />
        {el}
      </div>
      <Footer />
    </>
  )
}