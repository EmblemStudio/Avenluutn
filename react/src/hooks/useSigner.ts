import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Signer } from 'ethers'

export default () => {
  const [{ data: account }] = useAccount()
  const [data, setData] = useState<Signer>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const getSigner = useCallback(async () => {
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
  }, [account?.connector])

  useEffect(() => {
    getSigner()
  }, [getSigner])

  return { data, loading, error, getSigner }
}