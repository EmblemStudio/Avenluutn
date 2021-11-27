import React, { useEffect } from 'react'
import { useWallet } from 'use-wallet'

import useNotifications from '../hooks/useNotifications'
import Notification from './Notification'
import { noConnection, wrongNetwork } from '../utils'
import { NARRATOR_PARAMS, WARNINGS } from '../constants'

// TODO Notification block should float and freeze on screen so visible from anywhere

export default () => {
  const { notifications, removeNotification } = useNotifications()
  const wallet = useWallet()

  useEffect(() => {
    if (!noConnection(wallet)) removeNotification("warnings", WARNINGS.no_connection)
    if (!wrongNetwork(wallet, NARRATOR_PARAMS.network)) removeNotification("warnings", WARNINGS.wrong_network) 
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