/*
Content scripts 是在 Web 頁面內運行的 javascript 腳本。通過使用標準的DOM，它們可以獲取瀏覽器所訪問頁面的詳細信息，並可以修改這些信息。下面是 content script 可以做的一些事情範例：

從頁面中找到沒有寫成超鏈接形式的 url，並將它們轉成超鏈接。放大頁面字體使文字更清晰
找到並處理 DOM 中的 microformat
當然，content scripts 也有一些限制，它們不能做的事情包括：

只能使用 chrome.i18n, chrome.dom, chrome.storage, and a subset of chrome.runtime/chrome.extension.
不能訪問它所在擴展中定義的函數和變量
不能訪問 web 頁面或其它 content script 中定義的函數和變量
不能做 cross-site XMLHttpRequests
這些限制其實並不像看上去那麼糟糕。Content scripts 可以使用 messages 機制與它所在的擴展通信，來間接使用 chrome.*接口，或訪問擴展數據。Content scripts 還可以通過共享的 DOM 來與 web 頁面通信。更多功能參見執行環境。

！ content-script 的執行環境是在網頁的上下文中，而不是在擴展的上下文中。
！ 這意味著 content script 可以訪問網頁的 DOM，但不能訪問擴展的 API。
！ 此外， console.log 會顯示再網頁的 console 中，而不是在擴展的背景頁中。
*/
import { i18n } from "../libs/alias";
import { userStorage } from "../libs/user";
import { isNoUser } from "../libs/user/user.type";
import { LogSystem } from "../packages/log";

// 自動登入功能。
// 此功能放在背景服務的話，userStorage 只會在背景服務啟動時執行一次，導致點錯頁面就無法自動登入
userStorage.load().then(user => {
    const extensionName = i18n('extensionName');
    const msgAutoLogin = i18n('hasUser_bool', isNoUser(user) ? 'false' : 'true');
    LogSystem(`${extensionName} ${msgAutoLogin}`);
});