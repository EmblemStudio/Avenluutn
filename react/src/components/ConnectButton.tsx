import React, { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'

import { shortAddress } from '../utils'
import MetaMaskSVG from '../assets/images/metamask-fox.svg'
import WalletConnectSVG from '../assets/images/walletconnect-logo.svg'
import WalletLinkLogo from '../assets/images/coinbase-wallet.png'

const connectorImgs = [MetaMaskSVG, WalletConnectSVG, WalletLinkLogo]

export default () => {
  const [modalActive, setModalActive] = useState("")
  const [{ data }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  return (
    <div>
      {accountData?.connector?.ready ? 
        <a 
          className="button is-ghost is-medium is-size-5 is-vertical"
          onClick={() => disconnect()}
        >
          <span>Disconnect</span> 
          <span className="is-size-6">{
            accountData.ens ? 
              accountData.ens.name
            :
              shortAddress(accountData.address)
          }</span>
        </a>
       : 
        <a 
          className="button is-ghost is-medium is-size-5"
          onClick={() => setModalActive("is-active")}
        >
          Connect
        </a>
      }
      <div className={`modal ${modalActive}`}>
        <div className="modal-background" onClick={()=>setModalActive("")} />
        <div className="modal-content has-background-white">
          <div className="box">
            {data.connectors.map((x, i) => (
              <section className="section" key={x.id} >
                <a 
                  className="button is-ghost has-text-black"
                  onClick={() => { connect(x).then((res) => { 
                    if (res?.data !== undefined) setModalActive("")
                  })}}
                >
                  <img src={connectorImgs[i]} alt={x.name} width="80px"/>
                  <h2 className="subtitle pl-5">
                    {x.name}
                    {!x.ready && ' (unsupported)'}
                  </h2>
                </a>
              </section>
            ))}
          </div>
        </div>
        <button className="modal-close is-large" onClick={()=>setModalActive("")} />
      </div>
    </div>
  )
}