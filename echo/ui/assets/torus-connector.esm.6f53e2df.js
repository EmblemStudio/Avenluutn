import{A as t}from"./abstract-connector.esm.b8d83b65.js";import"./vendor.e2ee514a.js";var r=function(t){var r,e;function o(r){var e,o=r.chainId,n=r.initOptions,i=void 0===n?{}:n,s=r.constructorOptions,c=void 0===s?{}:s,u=r.loginOptions,a=void 0===u?{}:u;return(e=t.call(this,{supportedChainIds:[o]})||this).chainId=o,e.initOptions=i,e.constructorOptions=c,e.loginOptions=a,e}e=t,(r=o).prototype=Object.create(e.prototype),r.prototype.constructor=r,r.__proto__=e;var n=o.prototype;return n.activate=function(){try{var t=function(){return Promise.resolve(r.torus.login(r.loginOptions).then((function(t){return t[0]}))).then((function(t){return{provider:r.torus.provider,account:t}}))},r=this,e=function(){if(!r.torus)return Promise.resolve(import("./torus.esm.c05e1c28.js").then((function(t){var r;return null!=(r=null==t?void 0:t.default)?r:t}))).then((function(t){return r.torus=new t(r.constructorOptions),Promise.resolve(r.torus.init(r.initOptions)).then((function(){}))}))}();return Promise.resolve(e&&e.then?e.then(t):t())}catch(o){return Promise.reject(o)}},n.getProvider=function(){try{return Promise.resolve(this.torus.provider)}catch(t){return Promise.reject(t)}},n.getChainId=function(){try{return Promise.resolve(this.chainId)}catch(t){return Promise.reject(t)}},n.getAccount=function(){try{return Promise.resolve(this.torus.ethereum.send("eth_accounts").then((function(t){return t[0]})))}catch(t){return Promise.reject(t)}},n.deactivate=function(){return Promise.resolve()},n.close=function(){try{var t=this;return Promise.resolve(t.torus.cleanUp()).then((function(){t.emitDeactivate()}))}catch(r){return Promise.reject(r)}},o}(t);export{r as TorusConnector};