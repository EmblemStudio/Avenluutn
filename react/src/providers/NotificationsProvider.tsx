import React, { useState, createContext, ReactElement } from 'react'

import { Notifications } from '../utils'

const emptyNotifs: Notifications = {
  errors: [],
  warnings: [],
  status: []
}

interface INotificationsContext {
  notifications: Notifications,
  addNotification: Function,
  removeNotification: Function
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: emptyNotifs,
  addNotification: () => {},
  removeNotification: () => {}
})

export default ({ children }: { children: ReactElement }) => {
  const [notifications, setNotifications] = useState<Notifications>(emptyNotifs)

  function addNotification(type: "errors" | "warnings" | "status", text: string) {
    const index = notifications[type].indexOf(text)
    if (index === -1) {
      const newNotifs = Object.assign({}, notifications)
      newNotifs[type].push(text)
      setNotifications(newNotifs)
    }
  }
  
  function removeNotification(type: "errors" | "warnings" | "status", text: string) {
    const index = notifications[type].indexOf(text)
    if (index >= 0) {
      const newNotifs = Object.assign({}, notifications)
      newNotifs[type] = [...newNotifs[type].slice(0, index), ...newNotifs[type].slice(index + 1)]
      setNotifications(newNotifs)
    }
  }

  const value: INotificationsContext = {
    notifications,
    addNotification,
    removeNotification
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}