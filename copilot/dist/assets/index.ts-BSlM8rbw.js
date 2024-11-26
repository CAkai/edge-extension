import{b as g,u as x,i as n,n as l,L as C}from"./user.store-DvOBRXwm.js";import{N as f,n as s}from"./navigation.store-Dw7i6yul.js";import"./index-lOtXKBCI.js";function T(e,o){return!e.startsWith("data:")&&!e.startsWith("blob:")&&!e.startsWith("http")?Promise.reject("Invalid data URL"):fetch(e).then(t=>t.blob()).then(t=>new File([t],o,{type:t.type}))}async function w(e){g("Upload",e);const t=(await x.get()).icloud.access_token,i=new FormData;return i.append("files",e),t?fetch("http://172.16.32.95/file-server/api/v1/files",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PATCH, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"X-Requested-With, X-Custom-Header, accept, Content-Type","Access-Control-Allow-Credentials":"true"},body:i}).then(c=>{if(!c.ok)throw c;return c.json()}):Promise.reject("no token")}function I(e,o){return T(e,o).then(t=>w(t)).then(t=>t.error===""?t.message:Promise.reject(t.error))}function r(e,o,t,i){switch(e){case"success":d(o,t,i,"images/check.png",5e3);break;case"error":d(o,t,i,"images/cancel.png",5e3);break}}function d(e,o,t,i,c){chrome.notifications.create(e,{type:"basic",iconUrl:i,title:o,message:t},a=>{setTimeout(()=>{chrome.notifications.clear(a)},c)})}async function u(){const e=await s.get();return g(`Navigation: ${e}`),e===f.SidepanelChat}async function m(e,o){if(await chrome.sidePanel.open({windowId:e}),await u()){o();return}const t=setInterval(async()=>{await u()&&(clearInterval(t),o())},100)}function k(){chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:!0}).catch(e=>console.error(e)),chrome.runtime.onConnect.addListener(function(e){e.name===f.Sidepanel&&e.onDisconnect.addListener(async()=>{s.clear()})})}function p(e,o){I(e,o).then(()=>{r("success","icloud-copilot-contextmenu-upload-image-http",n("uploadImageToICloud"),n("uploadSuccess"))}).catch(async t=>{if(t==="no token"){r("error","icloud-copilot-no-token",n("noLogin"),n("loginTitle"));return}r("error","icloud-copilot-contextmenu-upload-image-http",n("uploadImageToICloud"),n("uploadFailed"))})}const h=[{id:"icloud-copilot-contextmenu-ask",title:n("ask_extensionName",n("extensionName")),contexts:["all"],onclick:(e,o)=>{m((o==null?void 0:o.windowId)??1,()=>{l({type:"clipboard",value:n("ask_extensionName",e.selectionText??"")},t=>console.log(t))})}},{id:"icloud-copilot-contextmenu-translate",title:n("translate_extensionName",n("extensionName")),contexts:["all"],onclick:(e,o)=>{m((o==null?void 0:o.windowId)??1,()=>{l({type:"clipboard",value:n("translate_content",e.selectionText??"")},t=>console.log(t))})}},{id:"icloud-copilot-contextmenu-upload-image",title:n("uploadImageToICloud"),contexts:["image"],onclick:e=>{var o,t;if((o=e.srcUrl)!=null&&o.startsWith("http")){const c=new RegExp(/^https?:\/\/.*\/(.*\.(jpg|png))$/).exec(e.srcUrl),a=c?c[1]:"image.png";p(e.srcUrl,a)}else(t=e.srcUrl)!=null&&t.startsWith("data:")&&p(e.srcUrl,"image.png")}}];function y(){chrome.runtime.onInstalled.addListener(()=>{h.map(e=>({id:e.id,title:e.title,contexts:e.contexts})).forEach(e=>{chrome.contextMenus.create(e)})}),chrome.contextMenus.onClicked.addListener((e,o)=>{var i;const t=h.find(c=>c.id===e.menuItemId);t&&((i=t.onclick)==null||i.call(t,e,o))})}s.clear();C(n("loaded_app",n("serviceWorker")));y();k();
