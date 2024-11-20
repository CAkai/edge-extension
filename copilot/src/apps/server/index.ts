/**
 * Service Worker 是在擴展功能運行時的背景服務，在同一時間只有一個實例處於活動狀態。
 * 在一個有背景頁的典型擴展中，使用者介面（比如，瀏覽器行為或者頁面行為和任何選項頁）是由沉默視圖實現的。當視圖需要一些狀態，它從背景頁獲取該狀態。當背景頁發現了狀態改變，它會通知視圖進行更新。
 */
import { i18n } from "../../libs/alias";
import { userStorage } from "../../libs/user/user.store";
import { isNoUser } from "../../libs/user/user.type";
import { LogSystem } from "../../packages/log";
import { registerContextMenuEvent } from "./contextmenu.service";
import { registerSidePanelEvent } from "./sidepanel.service";
import { navStorage } from "../../libs/navigation";

navStorage.clear();
LogSystem(i18n("loaded_app", i18n("serviceWorker")));
registerContextMenuEvent();
registerSidePanelEvent();

// 當有任意服務連接時，觸發事件
let isLoaded = false;
chrome.runtime.onConnect.addListener(() => {
    // 防止重複觸發
    if (isLoaded) return;

    isLoaded = true;

    // 背景服務啟動後，立即自動登入
    userStorage.load().then((user) => {
        LogSystem(i18n("hasUser_bool", isNoUser(user) ? "false" : "true"));
    });
});
