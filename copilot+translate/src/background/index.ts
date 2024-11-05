/**
 * 背景頁是一個運行在擴展進程中的HTML頁面。它在你的擴展的整個生命週期都存在，同時，在同一時間只有一個實例處於活動狀態。
 * 在一個有背景頁的典型擴展中，使用者介面（比如，瀏覽器行為或者頁面行為和任何選項頁）是由沉默視圖實現的。當視圖需要一些狀態，它從背景頁獲取該狀態。當背景頁發現了狀態改變，它會通知視圖進行更新。
*/
const CONTEXTMENU_ID = 'icloud-side-panel';

// 當瀏覽器安裝擴展時，會執行函數內的動作。
chrome.runtime.onInstalled.addListener(() => {
  // 註冊右鍵菜單
  chrome.contextMenus.create({
    id: CONTEXTMENU_ID,
    title: chrome.i18n.getMessage("extensionName"),
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXTMENU_ID) {
    chrome.tabs.sendMessage(tab?.windowId ?? 0, { type: 'openSidePanel' });
  }
});
