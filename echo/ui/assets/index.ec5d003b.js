import{e}from"./abstract-connector.esm.b8d83b65.js";var t={};Object.defineProperty(t,"__esModule",{value:!0});const r=e.exports;function i(e,t,r){try{Reflect.apply(e,t,r)}catch(i){setTimeout((()=>{throw i}))}}class n extends r.EventEmitter{emit(e,...t){let r="error"===e;const n=this._events;if(void 0!==n)r=r&&void 0===n.error;else if(!r)return!1;if(r){let e;if(t.length>0&&([e]=t),e instanceof Error)throw e;const r=new Error("Unhandled error."+(e?` (${e.message})`:""));throw r.context=e,r}const o=n[e];if(void 0===o)return!1;if("function"==typeof o)i(o,this,t);else{const e=o.length,r=function(e){const t=e.length,r=new Array(t);for(let i=0;i<t;i+=1)r[i]=e[i];return r}(o);for(let n=0;n<e;n+=1)i(r[n],this,t)}return!0}}t.default=n;var o=u;u.default=u,u.stable=h,u.stableStringify=h;var f=[],s=[];function l(){return{depthLimit:Number.MAX_SAFE_INTEGER,edgesLimit:Number.MAX_SAFE_INTEGER}}function u(e,t,r,i){var n;void 0===i&&(i=l()),c(e,"",0,[],void 0,0,i);try{n=0===s.length?JSON.stringify(e,t,r):JSON.stringify(e,p(t),r)}catch(u){return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")}finally{for(;0!==f.length;){var o=f.pop();4===o.length?Object.defineProperty(o[0],o[1],o[3]):o[0][o[1]]=o[2]}}return n}function a(e,t,r,i){var n=Object.getOwnPropertyDescriptor(i,r);void 0!==n.get?n.configurable?(Object.defineProperty(i,r,{value:e}),f.push([i,r,t,n])):s.push([t,r,e]):(i[r]=e,f.push([i,r,t]))}function c(e,t,r,i,n,o,f){var s;if(o+=1,"object"==typeof e&&null!==e){for(s=0;s<i.length;s++)if(i[s]===e)return void a("[Circular]",e,t,n);if(void 0!==f.depthLimit&&o>f.depthLimit)return void a("[...]",e,t,n);if(void 0!==f.edgesLimit&&r+1>f.edgesLimit)return void a("[...]",e,t,n);if(i.push(e),Array.isArray(e))for(s=0;s<e.length;s++)c(e[s],s,s,i,e,o,f);else{var l=Object.keys(e);for(s=0;s<l.length;s++){var u=l[s];c(e[u],u,s,i,e,o,f)}}i.pop()}}function d(e,t){return e<t?-1:e>t?1:0}function h(e,t,r,i){void 0===i&&(i=l());var n,o=v(e,"",0,[],void 0,0,i)||e;try{n=0===s.length?JSON.stringify(o,t,r):JSON.stringify(o,p(t),r)}catch(a){return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")}finally{for(;0!==f.length;){var u=f.pop();4===u.length?Object.defineProperty(u[0],u[1],u[3]):u[0][u[1]]=u[2]}}return n}function v(e,t,r,i,n,o,s){var l;if(o+=1,"object"==typeof e&&null!==e){for(l=0;l<i.length;l++)if(i[l]===e)return void a("[Circular]",e,t,n);try{if("function"==typeof e.toJSON)return}catch(p){return}if(void 0!==s.depthLimit&&o>s.depthLimit)return void a("[...]",e,t,n);if(void 0!==s.edgesLimit&&r+1>s.edgesLimit)return void a("[...]",e,t,n);if(i.push(e),Array.isArray(e))for(l=0;l<e.length;l++)v(e[l],l,l,i,e,o,s);else{var u={},c=Object.keys(e).sort(d);for(l=0;l<c.length;l++){var h=c[l];v(e[h],h,l,i,e,o,s),u[h]=e[h]}if(void 0===n)return u;f.push([n,t,e]),n[t]=u}i.pop()}}function p(e){return e=void 0!==e?e:function(e,t){return t},function(t,r){if(s.length>0)for(var i=0;i<s.length;i++){var n=s[i];if(n[1]===t&&n[0]===r){r=n[2],s.splice(i,1);break}}return e.call(this,t,r)}}export{o as f,t as s};