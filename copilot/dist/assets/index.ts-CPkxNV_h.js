import{b as m,u as g,i as n,n as s,L as f}from"./user.store-iA-FD-76.js";import{N as p,n as c}from"./navigation.store-Dw7i6yul.js";import"./index-lOtXKBCI.js";function T(e,o){return!e.startsWith("data:")&&!e.startsWith("blob:")&&!e.startsWith("http")?Promise.reject("Invalid data URL"):fetch(e).then(t=>t.blob()).then(t=>new File([t],o,{type:t.type}))}async function x(e){m("Upload",e);const t=(await g.get()).icloud.access_token,i=new FormData;return i.append("files",e),t?fetch("http://172.16.32.95/file-server/api/v1/files",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PATCH, PUT, DELETE, OPTIONS","Access-Control-Allow-Headers":"X-Requested-With, X-Custom-Header, accept, Content-Type","Access-Control-Allow-Credentials":"true"},body:i}).then(a=>{if(!a.ok)throw a;return a.json()}):Promise.reject("no token")}function C(e,o){return T(e,o).then(t=>x(t)).then(t=>t.error===""?t.message:Promise.reject(t.error))}async function r(){const e=await c.get();return m(`Navigation: ${e}`),e===p.SidepanelChat}async function l(e,o){if(await chrome.sidePanel.open({windowId:e}),await r()){o();return}const t=setInterval(async()=>{await r()&&(clearInterval(t),o())},100)}function I(){chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:!0}).catch(e=>console.error(e)),chrome.runtime.onConnect.addListener(function(e){e.name===p.Sidepanel&&e.onDisconnect.addListener(async()=>{c.clear()})})}function d(e,o){C(e,o).then(()=>{chrome.notifications.create("icloud-copilot-contextmenu-upload-image-http",{type:"basic",iconUrl:"images/check.png",title:n("uploadImageToICloud"),message:n("uploadSuccess")},t=>{setTimeout(()=>{chrome.notifications.clear(t)},3e3)})}).catch(async t=>{if(t==="no token"){chrome.notifications.create("icloud-copilot-no-token",{type:"basic",iconUrl:"images/cancel.png",title:n("noLogin"),message:n("loginTitle")},i=>{setTimeout(()=>{chrome.notifications.clear(i)},5e3)});return}chrome.notifications.create("icloud-copilot-contextmenu-upload-image-http",{type:"basic",iconUrl:"images/cancel.png",title:n("uploadImageToICloud"),message:n("uploadFailed")},i=>{setTimeout(()=>{chrome.notifications.clear(i)},5e3)})})}const u=[{id:"icloud-copilot-contextmenu-ask",title:n("ask_extensionName",n("extensionName")),contexts:["all"],onclick:(e,o)=>{l((o==null?void 0:o.windowId)??1,()=>{s({type:"clipboard",value:n("ask_extensionName",e.selectionText??"")},t=>console.log(t))})}},{id:"icloud-copilot-contextmenu-translate",title:n("translate_extensionName",n("extensionName")),contexts:["all"],onclick:(e,o)=>{l((o==null?void 0:o.windowId)??1,()=>{s({type:"clipboard",value:n("translate_content",e.selectionText??"")},t=>console.log(t))})}},{id:"icloud-copilot-contextmenu-upload-image",title:n("uploadImageToICloud"),contexts:["image"],onclick:e=>{var o,t;if((o=e.srcUrl)!=null&&o.startsWith("http")){const a=new RegExp(/^https?:\/\/.*\/(.*\.(jpg|png))$/).exec(e.srcUrl),h=a?a[1]:"image.png";d(e.srcUrl,h)}else(t=e.srcUrl)!=null&&t.startsWith("data:")&&d(e.srcUrl,"image.png")}}];function w(){chrome.runtime.onInstalled.addListener(()=>{u.map(e=>({id:e.id,title:e.title,contexts:e.contexts})).forEach(e=>{chrome.contextMenus.create(e)})}),chrome.contextMenus.onClicked.addListener((e,o)=>{var i;const t=u.find(a=>a.id===e.menuItemId);t&&((i=t.onclick)==null||i.call(t,e,o))})}c.clear();f(n("loaded_app",n("serviceWorker")));w();I();
