import { useContext } from 'react'

import { NarratorStateContext } from '../providers/NarratorStateProvider'

export default () => {
  const context = useContext(NarratorStateContext)
  console.log('using narrator state', context)
  return context.narratorState.narrator
}