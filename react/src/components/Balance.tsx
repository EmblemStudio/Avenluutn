import React, { useContext } from 'react'
import { useStorage } from '../hooks/useStorage'
import { currencyName } from '../constants'
import UserContext from '../providers/UserContext'

export default () => {
  const { setUser, user } = useContext(UserContext)
  return (
    <div className="is-size-5">
      {currencyName}: {user.balance}
    </div>
  )
}
