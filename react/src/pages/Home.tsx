import React from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'

import useNarratorReadable from '../hooks/useNarratorReadable'

function Home() {
  const publisher = useNarratorReadable("ropsten", 6)

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
          {publisher && <div>Hello</div>}
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