import React, { ReactElement} from 'react'

import Header from './Header'
import Footer from './Footer'
import NotificationsBlock from './NotificationsBlock'

export default ({ children }: { children: ReactElement }) => {
  return (
    <> 
      <div id="top">
        <Header />
        <section className="section pt-5 is-ibm is-size-6">
          <NotificationsBlock />
          {children}
        </section>
      </div>
      <Footer />
    </>
  )
}