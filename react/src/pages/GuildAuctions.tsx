import React from 'react'

import Layout from '../components/Layout'
import GuildHeader from '../components/GuildHeader'
import useNarratorReadable from '../hooks/useNarratorReadable'
import useGuild from '../hooks/useGuild'
import { READ_NARRATOR_PARAMS } from '../constants'

export default () => {
  const narrator = useNarratorReadable(READ_NARRATOR_PARAMS)
  const { guild, color } = useGuild(narrator)

  return Layout(
    <>
      { guild ? 
        GuildHeader(guild, "auctions")
      :
        null
      }
    </>
  )
}