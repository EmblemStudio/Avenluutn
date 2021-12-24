import{A as e}from"./abstract-connector.esm.b8d83b65.js";import"./vendor.e2ee514a.js";function r(){return(r=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}function t(e,r){return(t=Object.setPrototypeOf||function(e,r){return e.__proto__=r,e})(e,r)}function n(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var o=function(e){var o,i;function a(r){var t,o=r.url,i=r.appName,a=r.appLogoUrl,c=r.darkMode,h=r.supportedChainIds;return(t=e.call(this,{supportedChainIds:h})||this).url=o,t.appName=i,t.appLogoUrl=a,t.darkMode=c||!1,t.handleChainChanged=t.handleChainChanged.bind(n(t)),t.handleAccountsChanged=t.handleAccountsChanged.bind(n(t)),t}i=e,(o=a).prototype=Object.create(i.prototype),o.prototype.constructor=o,t(o,i);var c=a.prototype;return c.activate=function(){try{var e=this,t=function(){return Promise.resolve(e.provider.request({method:"eth_requestAccounts"})).then((function(r){var t=r[0];return e.provider.on("chainChanged",e.handleChainChanged),e.provider.on("accountsChanged",e.handleAccountsChanged),{provider:e.provider,account:t}}))},n=function(){if(window.ethereum&&!0===window.ethereum.isCoinbaseWallet)e.provider=window.ethereum;else{var t=function(){if(!e.walletLink)return Promise.resolve(import("./index.cf199a1e.js").then((function(e){return e.i})).then((function(e){var r;return null!=(r=null==e?void 0:e.default)?r:e}))).then((function(t){e.walletLink=new t(r({appName:e.appName,darkMode:e.darkMode},e.appLogoUrl?{appLogoUrl:e.appLogoUrl}:{})),e.provider=e.walletLink.makeWeb3Provider(e.url,1)}))}();if(t&&t.then)return t.then((function(){}))}}();return Promise.resolve(n&&n.then?n.then(t):t())}catch(o){return Promise.reject(o)}},c.getProvider=function(){try{return Promise.resolve(this.provider)}catch(e){return Promise.reject(e)}},c.getChainId=function(){try{return Promise.resolve(this.provider.chainId)}catch(e){return Promise.reject(e)}},c.getAccount=function(){try{return Promise.resolve(this.provider.request({method:"eth_requestAccounts"})).then((function(e){return e[0]}))}catch(e){return Promise.reject(e)}},c.deactivate=function(){this.provider.removeListener("chainChanged",this.handleChainChanged),this.provider.removeListener("accountsChanged",this.handleAccountsChanged)},c.close=function(){try{return this.provider.close(),this.emitDeactivate(),Promise.resolve()}catch(e){return Promise.reject(e)}},c.handleChainChanged=function(e){this.emitUpdate({chainId:e})},c.handleAccountsChanged=function(e){this.emitUpdate({account:e[0]})},a}(e);export{o as WalletLinkConnector};