import { navStorage } from "../../libs/navigation";
import { LogDebug, LogError } from "../../packages/log";

export function openSidePanel(windowId: number, callback: () => void) {
    chrome.sidePanel
        .open({ windowId: windowId })
        .then(async () => {
            const isInChat = async () => {
                const nav = await navStorage.get();
                LogDebug(`Navigation: ${nav}`);
                return nav === "sidepanel/chat";
            }

            if (await isInChat()) {
                callback();
                return;
            }

            const unsubscribe = navStorage.subscribe(async () => {
                if (await isInChat()) {
                    callback();
                    unsubscribe();
                }
            })
        })
        .catch((error) => LogError(error))
}

export function registerSidePanelEvent() {
    // 點擊擴充功能圖示時，打開側邊欄
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}