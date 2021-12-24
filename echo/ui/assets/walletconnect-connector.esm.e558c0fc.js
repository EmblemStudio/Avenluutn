import{A as e}from"./abstract-connector.esm.b8d83b65.js";import"./vendor.e2ee514a.js";function t(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,r(e,t)}function n(e){return(n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function i(e,t,n){return(i=o()?Reflect.construct:function(e,t,n){var o=[null];o.push.apply(o,t);var i=new(Function.bind.apply(e,o));return n&&r(i,n.prototype),i}).apply(null,arguments)}function c(e){var t="function"==typeof Map?new Map:void 0;return(c=function(e){if(null===e||(o=e,-1===Function.toString.call(o).indexOf("[native code]")))return e;var o;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,c)}function c(){return i(e,arguments,n(this).constructor)}return c.prototype=Object.create(e.prototype,{constructor:{value:c,enumerable:!1,writable:!0,configurable:!0}}),r(c,e)})(e)}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var u="URI_AVAILABLE",s=function(e){function n(){var t;return(t=e.call(this)||this).name=t.constructor.name,t.message="The user rejected the request.",t}return t(n,e),n}(c(Error));var l=function(e){function n(t){var n,r,o,i;return(n=e.call(this,{supportedChainIds:(r=t,o=r.supportedChainIds,i=r.rpc,o||(i?Object.keys(i).map((function(e){return Number(e)})):void 0))})||this).config=t,n.handleChainChanged=n.handleChainChanged.bind(a(n)),n.handleAccountsChanged=n.handleAccountsChanged.bind(a(n)),n.handleDisconnect=n.handleDisconnect.bind(a(n)),n}t(n,e);var r=n.prototype;return r.handleChainChanged=function(e){this.emitUpdate({chainId:e})},r.handleAccountsChanged=function(e){this.emitUpdate({account:e[0]})},r.handleDisconnect=function(){this.emitDeactivate(),this.walletConnectProvider&&(this.walletConnectProvider.stop(),this.walletConnectProvider.removeListener("chainChanged",this.handleChainChanged),this.walletConnectProvider.removeListener("accountsChanged",this.handleAccountsChanged),this.walletConnectProvider=void 0),this.emitDeactivate()},r.activate=function(){try{var e=this,t=function(){function t(){return Promise.resolve(e.walletConnectProvider.enable().then((function(e){return e[0]})).catch((function(e){if("User closed modal"===e.message)throw new s;throw e}))).then((function(t){return e.walletConnectProvider.on("disconnect",e.handleDisconnect),e.walletConnectProvider.on("chainChanged",e.handleChainChanged),e.walletConnectProvider.on("accountsChanged",e.handleAccountsChanged),{provider:e.walletConnectProvider,account:t}}))}var n=function(){if(!e.walletConnectProvider.wc.connected)return Promise.resolve(e.walletConnectProvider.wc.createSession({chainId:e.supportedChainIds&&e.supportedChainIds.length>0?e.supportedChainIds[0]:1})).then((function(){e.emit("URI_AVAILABLE",e.walletConnectProvider.wc.uri)}))}();return n&&n.then?n.then(t):t()},n=function(){if(!e.walletConnectProvider)return Promise.resolve(import("./index.56cee495.js").then((function(e){var t;return null!=(t=null==e?void 0:e.default)?t:e}))).then((function(t){e.walletConnectProvider=new t(e.config)}))}();return Promise.resolve(n&&n.then?n.then(t):t())}catch(r){return Promise.reject(r)}},r.getProvider=function(){try{return Promise.resolve(this.walletConnectProvider)}catch(e){return Promise.reject(e)}},r.getChainId=function(){try{return Promise.resolve(this.walletConnectProvider.send("eth_chainId"))}catch(e){return Promise.reject(e)}},r.getAccount=function(){try{return Promise.resolve(this.walletConnectProvider.send("eth_accounts").then((function(e){return e[0]})))}catch(e){return Promise.reject(e)}},r.deactivate=function(){this.walletConnectProvider&&(this.walletConnectProvider.stop(),this.walletConnectProvider.removeListener("disconnect",this.handleDisconnect),this.walletConnectProvider.removeListener("chainChanged",this.handleChainChanged),this.walletConnectProvider.removeListener("accountsChanged",this.handleAccountsChanged))},r.close=function(){try{var e;return Promise.resolve(null==(e=this.walletConnectProvider)?void 0:e.close()).then((function(){}))}catch(t){return Promise.reject(t)}},n}(e);export{u as URI_AVAILABLE,s as UserRejectedRequestError,l as WalletConnectConnector};