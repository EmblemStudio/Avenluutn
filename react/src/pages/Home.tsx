import React from 'react'

import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GuildButtons from '../components/GuildButtons'
import useNarratorReadable from '../hooks/useNarratorReadable'

function Home() {
  const narrator = useNarratorReadable("ropsten", 6)

  return Layout(
    <section className="section is-ibm is-size-6">
      <div className="block">
        You have entered Avenluutn, on the edge of nowhere.
      </div>
      <div className="block">
        The humble road into town smells of grass and earth. 
        Sweet wind rustles the treetops. You feel hopeful.
      </div>
      {
        narrator ? 
          <div className="container">
            <div className="block">
              A sign in the road directs you. Choose a guild:
            </div>
            {GuildButtons(
              narrator.collections[narrator.collections.length - 1].scriptResult.nextState.guilds
            )}
          </div>
        : 
          /* TODO Add a "Return in [timer]"
          <div className="block has-text-grey">
            Return in [timer]
          </div>
          */
          null
      }
    </section>
  )
}

export default Home