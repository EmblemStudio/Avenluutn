import { useContext } from 'react'

import { NarratorStateContext } from '../providers/NarratorStateProvider'

export default () => {
  const context = useContext(NarratorStateContext)
  return context.narratorState.narrator
}