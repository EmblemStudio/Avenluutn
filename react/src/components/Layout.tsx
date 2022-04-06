import React, { ReactElement } from 'react'
import { Suspense } from 'react'

import Header from './Header'
import Footer from './Footer'
import NotificationsBlock from './NotificationsBlock'
import LoadingAnimation from './LoadingAnimation'

export default ({ children }: { children: ReactElement }) => {
  return (
    <>
      <div id="top">
        <Header />
        <section className="section pt-5 is-ibm is-size-6">
          <NotificationsBlock />
          <Suspense fallback={<LoadingAnimation />}>
            {children}
          </Suspense>
        </section>
      </div>
      <Footer />
    </>
  )
}