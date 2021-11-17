import React, { useState } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
      <div id="top">
        <Header />
        <section className="section is-ibm is-size-6">
          <div className="block">
            You have entered Avenluutn, on the edge of nowhere.
          </div>
          <div className="block">
            The humble road into town smells of grass and earth. 
            Sweet wind rustles the treetops. You feel hopeful.
          </div>
          <div className="block has-text-grey">
            Return in [timer]
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Home