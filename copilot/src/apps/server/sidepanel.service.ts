import { navStorage } from "../../libs/navigation";
import { LogDebug } from "../../packages/log";
import { NAVIGATION_NAME } from "../../libs/navigation/navigation.constant";

async function isInChat() {
    const nav = await navStorage.get();
    LogDebug(`Navigation: ${nav}`);
    return nav === NAVIGATION_NAME.SidepanelChat;
}

export async function openSidePanel(windowId: number, callback: () => void) {
    await chrome.sidePanel.open({ windowId: windowId });
    
    // 如果已經在聊天室，直接執行 callback
    if (await isInChat()) {
        callback();
        return;
    }

    // 等待進入聊天室
    const interval = setInterval(async () => {
        if (await isInChat()) {
            clearInterval(interval);
            callback();
        }
    }, 100);
}

export function registerSidePanelEvent() {
    // 點擊擴充功能圖示時，打開側邊欄
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name === NAVIGATION_NAME.Sidepanel) {
            port.onDisconnect.addListener(async () => {
                // 當側邊欄被關閉時，清除 navigation storage
                // 否則下一次開啟側邊欄時，右鍵選單會失效
                navStorage.clear();
            });
        }
    });
}