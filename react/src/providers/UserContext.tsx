import { createContext } from 'react'
import { Guild } from '../../../scripts/src'
import { Story } from '../utils'
import { defaultBalance } from '../constants'

interface Bet {
  betId: string
  amount: number
  guild: Guild
  story: Story
}

interface User {
  balance: number
  bets: Bet[]
}

const defaultUser = {
  setUser: () => {},
  user: { balance: defaultBalance, bets: [] },
}

const UserContext = createContext(defaultUser)

export default UserContext
export { defaultUser }
