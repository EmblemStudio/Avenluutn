import React from 'react'

import GuildHeader from '../components/GuildHeader'
import useNarratorState from '../hooks/useNarratorState'
import useGuild from '../hooks/useGuild'

export default () => {
  const narrator = useNarratorState()
  const { guild, color } = useGuild(narrator)

  return (
    <>
      <GuildHeader guild={guild} selected="auctions"/>
    </>
  )
}