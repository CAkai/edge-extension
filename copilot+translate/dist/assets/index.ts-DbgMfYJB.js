import{u as c,U as i}from"./index-BmQNzxyB.js";const n="icloud-side-panel";let s=!1;chrome.runtime.onInstalled.addListener(()=>{chrome.contextMenus.create({id:n,title:chrome.i18n.getMessage("extensionName"),contexts:["all"]})});chrome.tabs.onActivated.addListener(()=>{s||l()});async function l(){let o=await chrome.tabs.query({active:!0,currentWindow:!0});if(o=o.filter(a=>a.url&&!a.url.startsWith("chrome://")),o.length===0)return;const r=await chrome.scripting.executeScript({target:{tabId:o[0].id??0},func:()=>JSON.stringify(localStorage)});if(console.error("localstorage",r[0].result),r[0].result){const a=JSON.parse(r[0].result),e=c(i);e.access_token=a.access_token,console.error("token",e.access_token),await fetch("http://192.168.1.165:3003/api/v1/auth",{method:"GET",headers:{Authorization:`Bearer ${e.access_token}`}}).then(t=>t.json()).then(t=>{e.id=t.id,e.name=t.name,e.email=t.email,e.role=t.role,e.department=t.department,e.fab=t.fab,console.error("2",e)}).catch(t=>{console.error("error",t)}),s=!0}}chrome.contextMenus.onClicked.addListener((o,r)=>{o.menuItemId===n&&chrome.tabs.sendMessage((r==null?void 0:r.windowId)??0,{type:"openSidePanel"})});
