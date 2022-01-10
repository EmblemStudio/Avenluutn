import React, { useEffect } from 'react'
import { useNetwork } from 'wagmi'

import useNotifications from '../hooks/useNotifications'
import Notification from './Notification'
import useSigner from '../hooks/useSigner'
import { NARRATOR_PARAMS, WARNINGS } from '../constants'

export default () => {
  const { notifications, removeNotification } = useNotifications()
  const {data: signer} = useSigner()
  const [{data: network}] = useNetwork()

  useEffect(() => {
    if (signer?.provider !== undefined) removeNotification("warnings", WARNINGS.no_connection)
    if (NARRATOR_PARAMS.network === network.chain?.name) removeNotification("warnings", WARNINGS.wrong_network)
  }, [notifications])

  function closeFactory(type: "errors" | "warnings" | "status", text: string) {
    return () => {
      removeNotification(type, text)
    }
  }

  return (
    <div className="container is-fluid pl-4 pb-3">
      {notifications.errors.map((e, i) => {
        return <Notification key={i} text={"Error: " + e} color="red" close={closeFactory("errors", e)}/>
      })}
      {notifications.warnings.map((w, i) => {
        return <Notification key={i} text={"Warning: " + w} color="orange" close={closeFactory("warnings", w)}/>
      })}
      {notifications.status.map((s, i) => {
        return <Notification key={i} text={"Status: " + s} color="green" close={closeFactory("status", s)}/>
      })}
    </div>
  )
}