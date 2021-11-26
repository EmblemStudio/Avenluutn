import React, { useEffect } from 'react'
import { useWallet } from 'use-wallet'

import useNotifications from '../hooks/useNotifications'
import Notification from './Notification'

export default () => {
  const { notifications, removeNotification } = useNotifications()
  const wallet = useWallet()

  useEffect(() => { 
    console.log('use effect notifs', notifications)
  }, [wallet])

  function closeFactory(type: "errors" | "warnings" | "status", text: string) {
    return () => {
      removeNotification(type, text)
    }
  }

  return (
    <div className="container is-fluid pl-4 pb-3">
      {notifications.errors.map((e, i) => {
        return Notification("Error: " + e, "red", i, closeFactory("errors", e))
      })}
      {notifications.warnings.map((w, i) => {
        return Notification("Warning: " + w, "orange", i, closeFactory("warnings", w))
      })}
      {notifications.status.map((s, i) => {
        return Notification("Status: " + s, "green", i, closeFactory("status", s))
      })}
    </div>
  )
}