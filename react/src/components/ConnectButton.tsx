import React, { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'

import { shortAddress } from '../utils'
import MetaMaskSVG from '../assets/images/metamask-fox.svg'
import WalletConnectSVG from '../assets/images/walletconnect-logo.svg'
import WalletLinkLogo from '../assets/images/coinbase-wallet.png'

const connectorImgs = [MetaMaskSVG, WalletConnectSVG, WalletLinkLogo]

const connectorAlts = [
  {
    text: "Install Metamask",
    url: "https://metamask.io/"
  },
  {
    text: "Find wallets that use WalletConnect",
    url: "https://walletconnect.com/"
  },
  {
    text: "Find wallets that use WalletLink",
    url: "https://walletlink.org/#/"
  }
]

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
                {x.ready ?
                  <a 
                    className="button is-ghost has-text-black"
                    onClick={() => { connect(x).then((res) => { 
                      if (res?.data !== undefined) setModalActive("")
                    })}}
                  >
                    <img src={connectorImgs[i]} alt={x.name} width="80px"/>
                    <h2 className="subtitle pl-5">
                      {x.name}
                    </h2>
                  </a>
                :
                  <a 
                    className="button is-ghost has-text-black"
                    target="_blank" href={connectorAlts[i].url}
                  >
                    <img src={connectorImgs[i]} alt={x.name} width="80px"/>
                    <h2 className="subtitle pl-5">
                      {connectorAlts[i].text}
                    </h2>
                  </a>
                }
              </section>
            ))}
          </div>
        </div>
        <button className="modal-close is-large" onClick={()=>setModalActive("")} />
      </div>
    </div>
  )
}