import { i18n, notify } from "../../libs/alias";
import { openSidePanel } from "./sidepanel.service";

type ContextMenu = {
    id: string;
    title: string;
    contexts: chrome.contextMenus.ContextType[];
    onclick?: (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => Promise<void> | void;
}

// 右側菜單選項。暴露出去，方便其他地方使用。
export enum ContextMenuOption {
    ASK = "icloud-copilot-contextmenu-ask",
    TRANSLATE = "icloud-copilot-contextmenu-translate",
    UPLOAD_IMAGE_TO_ICLOUD = "icloud-copilot-contextmenu-upload-image"
}

// 右側菜單註冊列表
export const CONTEXTMENUS: ContextMenu[] = [
    {   // 詢問
        id: ContextMenuOption.ASK,
        title: i18n("ask_extensionName",i18n("extensionName")),
        contexts: ["all"],
        onclick: (info, tab) => {
            openSidePanel(tab?.windowId ?? 1, () => {
                notify({
                    type: "clipboard",
                    value: i18n("ask_extensionName", info.selectionText ?? "")
                }, (response) => console.log(response));
            });
        }
    },
    {   // 翻譯
        id: ContextMenuOption.TRANSLATE,
        title: i18n("translate_extensionName",i18n("extensionName")),
        contexts: ["all"],
        onclick: (info, tab) => {
            openSidePanel(tab?.windowId ?? 1, () => {
                notify({
                    type: "clipboard",
                    value: i18n("translate_content", info.selectionText ?? "")
                },
                    (response) => console.log(response))
            });
        }
    },
    {   // 將圖片上傳到 iCloud
        id: ContextMenuOption.UPLOAD_IMAGE_TO_ICLOUD,
        title: i18n("uploadImageToICloud"),
        contexts: ["image"]
    }
];

export function registerContextMenuEvent() {
    // 當瀏覽器安裝擴展時，會執行函數內的動作。
    chrome.runtime.onInstalled.addListener(() => {
        CONTEXTMENUS
        .map(c => ({id: c.id, title: c.title, contexts: c.contexts}))
        .forEach((contextMenu) => {
            chrome.contextMenus.create(contextMenu);
        });
    });
    // 當右鍵點擊時，會執行函數內的動作。
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        const contextMenu = CONTEXTMENUS.find(c => c.id === info.menuItemId);
        if (contextMenu) {
            void contextMenu.onclick?.(info, tab);
        }
    });
}