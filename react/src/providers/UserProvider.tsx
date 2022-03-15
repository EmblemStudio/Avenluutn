import React, { createContext, useEffect } from 'react'
import useStorage from '../hooks/useStorage'
import { User } from '../utils'
import { STORAGE_VERSION } from '../constants'

interface IUserContext {
  user: User;
  setUser: (user: User) => void;
}

const defaultUser: User = { balance: 1000, shares: {} }

const emptyUserContext = { user: defaultUser, setUser: () => { } }

export const UserContext = createContext<IUserContext>(emptyUserContext)

export default ({ children }: { children: React.ReactElement }) => {
  const [user, setUser] = useStorage<User>("user" + STORAGE_VERSION, emptyUserContext.user)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
