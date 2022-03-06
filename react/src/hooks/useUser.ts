import { useContext } from 'react'
import { UserContext } from '../providers/UserProvider'

export default () => {
  // TODO perhaps this function takes narratorState optionally, and if submitted, updates loot share results
  return useContext(UserContext)
}