import { useContext } from 'react'

import { NotificationsContext } from '../providers/NotificationsProvider'

export default () => {
  return useContext(NotificationsContext)
}