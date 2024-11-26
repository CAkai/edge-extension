import { i18n, notify } from "../../libs/alias";
import { downloadFileToCloud } from "../../libs/file/file.api";
import { getImageData } from "../../libs/file/file.util";
import { chromeNotify } from "../../packages/chrome/notification";
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
    UPLOAD_IMAGE_TO_ICLOUD = "icloud-copilot-contextmenu-upload-image",
    UPLOAD_IMAGE_TO_CHAT = "icloud-copilot-contextmenu-upload-image-to-chat",
    NO_TOKEN = "icloud-copilot-no-token",
}

function uploadImageToICloud(dataURL: string, filename: string, fileType: string) {
    downloadFileToCloud(dataURL, filename, fileType)
        .then(() => {
            chromeNotify(
                "success",
                `${ContextMenuOption.UPLOAD_IMAGE_TO_ICLOUD}-${crypto.randomUUID()}`,
                i18n("uploadImageToICloud"),
                i18n("uploadSuccess"),
            );
        })
        .catch(async (err: string) => {
            if (err === "no token") {
                // 發送 未登入 通知後，打開側邊欄
                chromeNotify(
                    "error",
                    `${ContextMenuOption.NO_TOKEN}-${crypto.randomUUID()}`,
                    i18n("noLogin"),
                    i18n("loginTitle"),
                );
                return;
            }

            chromeNotify(
                "error",
                `${ContextMenuOption.UPLOAD_IMAGE_TO_ICLOUD}-${crypto.randomUUID()}`,
                i18n("uploadImageToICloud"),
                i18n("uploadFailed"),
            );
        })
}

// 右側菜單註冊列表
export const CONTEXTMENUS: ContextMenu[] = [
    {   // 詢問
        id: ContextMenuOption.ASK,
        title: i18n("ask_extensionName", i18n("extensionName")),
        contexts: ["all"],
        onclick: (info, tab) => {
            // 先存起來，防止 tab 關閉後找不到
            const text = info.selectionText ?? "";
            openSidePanel(tab?.windowId ?? 1, () => {
                notify({
                    type: "clipboard",
                    value: i18n("ask_extensionName", text)
                }, (response) => console.log(response));
            });
        }
    },
    {   // 翻譯
        id: ContextMenuOption.TRANSLATE,
        title: i18n("translate_extensionName", i18n("extensionName")),
        contexts: ["all"],
        onclick: (info, tab) => {
            // 先存起來，防止 tab 關閉後找不到
            const text = info.selectionText ?? "";
            openSidePanel(tab?.windowId ?? 1, () => {
                notify({
                    type: "clipboard",
                    value: i18n("translate_content", text)
                },
                    (response) => console.log(response))
            });
        }
    },
    {   // 將圖片上傳到 iCloud
        id: ContextMenuOption.UPLOAD_IMAGE_TO_ICLOUD,
        title: i18n("uploadImageToICloud"),
        contexts: ["image"],
        onclick: (info) => {
            const { fileName, fileType } = getImageData(info.srcUrl ?? "");
            uploadImageToICloud(info.srcUrl ?? "", fileName, fileType);
        }
    },
    {  // 將圖片上傳到聊天室
        id: ContextMenuOption.UPLOAD_IMAGE_TO_CHAT,
        title: i18n("uploadImageToChat"),
        contexts: ["image"],
        onclick: async (info, tab) => {
            if (!info.srcUrl) {
                chromeNotify(
                    "error",
                    `${ContextMenuOption.UPLOAD_IMAGE_TO_CHAT}-${crypto.randomUUID()}`,
                    i18n("uploadImageToChat"),
                    i18n("uploadFailed"),
                )
                return;
            }
            openSidePanel(tab?.windowId ?? 1, () => {
                notify({
                    type: "upload-image",
                    value: info.srcUrl,
                }, (response) => console.log(response));
            });
        }
    }
];

export function registerContextMenuEvent() {
    // 當瀏覽器安裝擴展時，會執行函數內的動作。
    chrome.runtime.onInstalled.addListener(() => {
        CONTEXTMENUS
            .map(c => ({ id: c.id, title: c.title, contexts: c.contexts }))
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