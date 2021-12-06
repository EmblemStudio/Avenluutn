import React, { useState } from 'react'
import { useWallet } from 'use-wallet'

import { shortAddress } from '../utils'
import MetamaskSVG from '../assets/images/metamask-fox.svg'
import WalletConnectSVG from '../assets/images/walletconnect-logo.svg'

export default () => {
  const [modalActive, setModalActive] = useState("")
  const wallet = useWallet()

  return (
    <div>
      {wallet.status === 'connected' ? (
        <a 
          className="button is-ghost is-medium is-size-5 is-vertical"
          onClick={() => wallet.reset()}
        >
          <span>Disconnect</span> 
          <span className="is-size-6">{shortAddress(wallet.account)}</span>
        </a>
      ) : (
        <a 
          className="button is-ghost is-medium is-size-5"
          onClick={() => setModalActive("is-active")}
        >
          Connect
        </a>
      )}
      <div className={`modal ${modalActive}`}>
        <div className="modal-background" onClick={()=>setModalActive("")} />
        <div className="modal-content has-background-white">
          <div className="box">
            <section className="section">
              <a 
                className="button is-ghost has-text-black"
                onClick={()=>{
                  wallet.connect("injected")
                  setModalActive("")
                }}
              >
                <img src={MetamaskSVG} alt="Metamask" width="80px"/>
                <h2 className="subtitle pl-5">Metamask</h2>
              </a>
            </section>
          </div>
        </div>
        <button className="modal-close is-large" onClick={()=>setModalActive("")} />
      </div>
    </div>
  )
}

// TODO Walletconnect
/*
<section className="section">
  <a 
    className="button is-ghost has-text-black"
    onClick={()=>{
      console.log('trying to do walletconnect')
      wallet.connect("walletconnect").then(() => console.log('wallet', wallet))
      setModalActive("")
    }}
  >
    <img src={WalletConnectSVG} alt="WalletConnect" width="80px"/>
    <h2 className="subtitle pl-5">WalletConnect</h2>
  </a>
</section>
*/