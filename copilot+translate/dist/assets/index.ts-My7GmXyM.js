import{L as m,a as u,i as n,n as s,b as d,u as g,c as p}from"./user.store-BRRQ5lob.js";import{c as h,S as v}from"./index-HtbmZJu6.js";const r=h("navigation-storage-key","",{storageEnum:v.Local,liveUpdate:!0});function c(e,t){chrome.sidePanel.open({windowId:e}).then(async()=>{const o=async()=>{const i=await r.get();return u(`Navigation: ${i}`),i==="sidepanel/chat"};if(await o()){t();return}const a=r.subscribe(async()=>{await o()&&(t(),a())})}).catch(o=>m(o))}function f(){chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:!0}).catch(e=>console.error(e))}const l=[{id:"icloud-copilot-contextmenu-ask",title:n("ask_extensionName",n("extensionName")),contexts:["all"],onclick:(e,t)=>{c((t==null?void 0:t.windowId)??1,()=>{s({type:"clipboard",value:e.selectionText},o=>console.log(o))})}},{id:"icloud-copilot-contextmenu-translate",title:n("translate_extensionName",n("extensionName")),contexts:["all"],onclick:(e,t)=>{c((t==null?void 0:t.windowId)??1,()=>{s({type:"clipboard",value:n("translate_content",e.selectionText??"")},o=>console.log(o))})}},{id:"icloud-copilot-contextmenu-upload-image",title:n("uploadImageToICloud"),contexts:["image"]}];function E(){chrome.runtime.onInstalled.addListener(()=>{l.map(e=>({id:e.id,title:e.title,contexts:e.contexts})).forEach(e=>{chrome.contextMenus.create(e)})}),chrome.contextMenus.onClicked.addListener((e,t)=>{l.forEach(o=>{var a;e.menuItemId===o.id&&((a=o==null?void 0:o.onclick)==null||a.call(o,e,t))})})}d(n("loaded_app",n("serviceWorker")));E();f();g.load().then(e=>{d(n("hasUser_bool",p(e)?"false":"true"))});