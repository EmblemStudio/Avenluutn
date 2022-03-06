import React, { createContext } from 'react'
import useStorage from '../hooks/useStorage'
import { User } from '../utils'
import { DEFAULT_USER } from '../constants'

interface IUserContext {
  user: User;
  setUser: Function;
}

const emptyUserContext = { user: DEFAULT_USER, setUser: () => { } }

export const UserContext = createContext<IUserContext>(emptyUserContext)

export default ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useStorage<User>("user", emptyUserContext.user)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
