import React, { useContext } from 'react'
import { CURRENCY } from '../constants'
import { UserContext } from '../providers/UserProvider'

export default () => {
  const { user } = useContext(UserContext)
  return (
    <div>
      {CURRENCY}: {user.balance}
    </div>
  )
}
