// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({openPanelOnActionClick: true})
  .catch((error) => console.error(error))

chrome.runtime.onInstalled.addListener(() => {
  // 在右鍵選單中新增 iCloud Copilot 選項
  chrome.contextMenus.create({
    id: 'icloud-copilot',
    title: `${chrome.i18n.getMessage('extensionName')}`,
    contexts: ['all'],
  })
})

// 當使用者點擊右鍵選單中的 iCloud Copilot 選項時，開啟側邊欄
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'icloud-copilot') {
    // This will open the panel in all the pages on the current window.
    await chrome.sidePanel.open({windowId: tab.windowId})
    // wait for the panel to be opened
    await new Promise((resolve) => setTimeout(resolve, 200))
    chrome.runtime.sendMessage({
      name: info.menuItemId,
      data: info,
    })
  }
})