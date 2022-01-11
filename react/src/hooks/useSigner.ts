import { useState, useEffect, useCallback } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { Signer } from 'ethers'

export default () => {
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [data, setData] = useState<Signer>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const getSigner = useCallback(async () => {
    console.log('running callback')
    setLoading(true)
    setError(undefined)

    try {
      const signer = await account?.connector?.getSigner()
      setData(signer)
    } catch (e: any) {
      setError(e)
      setData(undefined)
    }

    setLoading(false)
  }, [network.chain?.id, account?.connector])

  useEffect(() => {
    getSigner()
  }, [getSigner])

  return { data, loading, error, getSigner }
}