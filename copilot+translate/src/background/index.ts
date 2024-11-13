/**
 * 背景頁是一個運行在擴展進程中的HTML頁面。它在你的擴展的整個生命週期都存在，同時，在同一時間只有一個實例處於活動狀態。
 * 在一個有背景頁的典型擴展中，使用者介面（比如，瀏覽器行為或者頁面行為和任何選項頁）是由沉默視圖實現的。當視圖需要一些狀態，它從背景頁獲取該狀態。當背景頁發現了狀態改變，它會通知視圖進行更新。
*/
const CONTEXTMENU_ASK_ID = 'ask-icloud-side-panel';
const CONTEXTMENU_TRANSLATE_ID = 'translate-icloud-side-panel';

// 當瀏覽器安裝擴展時，會執行函數內的動作。
chrome.runtime.onInstalled.addListener(() => {
  // 右鍵菜單註冊「詢問」
  chrome.contextMenus.create({
    id: CONTEXTMENU_ASK_ID,
    title: `${chrome.i18n.getMessage("ask")} ${chrome.i18n.getMessage("extensionName")}`,
    contexts: ["all"],
  });
  // 右鍵菜單註冊「翻譯」
  chrome.contextMenus.create({
    id: CONTEXTMENU_TRANSLATE_ID,
    title: chrome.i18n.getMessage("translateICloudAI").replace("{{extensionName}}", chrome.i18n.getMessage("extensionName")),
    contexts: ["all"],
  });
});

// 點擊擴充功能圖示時，打開側邊欄
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function OpenSidePanel(id: number, callback: () => void) {
  chrome.sidePanel.open({ windowId: id })
    .then(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cb = async (result: { [key: string]: any }) => {
        if (result.isInChat) {
          callback();
        } else {
          setTimeout(() => {
            chrome.storage.local.get("isInChat", cb);
          }, 200);
        }
      }
      // 因為背景頁無法直接讀取 React 的 store，所以利用 chrome.storage.local.isInChat 記錄是否在聊天頁面。
      chrome.storage.local.get("isInChat", cb);
    })
    .catch((error) => console.error(error));
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case CONTEXTMENU_ASK_ID:
      // 打開側邊欄
      OpenSidePanel(tab?.windowId ?? 1, () => {
        chrome.runtime.sendMessage({ type: "clipboard", value: info.selectionText }, (response) => console.log(response));
      });
      break;
    case CONTEXTMENU_TRANSLATE_ID:
      OpenSidePanel(tab?.windowId ?? 1, () => {
        chrome.runtime.sendMessage({
          type: "clipboard",
          value: chrome.i18n.getMessage("translateContent").replace("{{content}}", info.selectionText ?? "")
        },
          (response) => console.log(response))
      });
      break;
    default:
      break;
  }
});
