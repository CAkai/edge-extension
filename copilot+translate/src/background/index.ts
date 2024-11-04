import userStore from "../store/user.store";

/**
 * 背景頁是一個運行在擴展進程中的HTML頁面。它在你的擴展的整個生命週期都存在，同時，在同一時間只有一個實例處於活動狀態。
 * 在一個有背景頁的典型擴展中，使用者介面（比如，瀏覽器行為或者頁面行為和任何選項頁）是由沉默視圖實現的。當視圖需要一些狀態，它從背景頁獲取該狀態。當背景頁發現了狀態改變，它會通知視圖進行更新。
*/
const CONTEXTMENU_ID = 'icloud-side-panel';
let fistLoadTab = false;

// 當瀏覽器安裝擴展時，會執行函數內的動作。
chrome.runtime.onInstalled.addListener(() => {
  // 註冊右鍵菜單
  chrome.contextMenus.create({
    id: CONTEXTMENU_ID,
    title: chrome.i18n.getMessage("extensionName"),
    contexts: ["all"],
  });
});

chrome.tabs.onActivated.addListener(() => {
  if (!fistLoadTab) {
    getLocalStorage();
  }
});

// 儲存 localStorage 到 chrome.storage.local 以及寫入 iCloudUser
// function saveStorage() {
//   console.error("1.5");
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i);
//     if (!key) {
//       continue;
//     }

//     const value = localStorage.getItem(key);
//     console.error(key, value);
//   }
//   console.log(user);
//   return user;
// }

// 取得瀏覽器的 localStorage，並儲存到 chrome.storage.local 以及寫入 iCloudUser
async function getLocalStorage() {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  // 過濾掉 chrome:// 開頭的tab
  tabs = tabs.filter(tab => tab.url && !tab.url.startsWith("chrome://"));

  // 如果沒有找到符合條件的tab，則返回
  if (tabs.length === 0) {
    return;
  }

  // Execute script in the current tab
  const st = await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id ?? 0 },
    func: () => {
      return JSON.stringify(localStorage);
    }
  });
  if (st[0].result) {
    const data = JSON.parse(st[0].result);

    // 到 iCloud 取得使用者資料
    await fetch(import.meta.env.VITE_ICLOUD_URL + "api/v1/auth", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${data.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          console.error(`連線到 iCloud 時，發生了錯誤：${res.error}`);
          return;
        }

        if (res.access_token !== "") {
          userStore.dispatch({ type: 'user/save', payload: res });
          console.log("搜尋到 iCloud Token，正在自動登入...");
        }
      })
      .catch((err) => {
        console.error("error", err);
      });
    fistLoadTab = true; // 防止重複執行
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXTMENU_ID) {
    chrome.tabs.sendMessage(tab?.windowId ?? 0, { type: 'openSidePanel' });
  }
});
