// getLocalStorage 函數會從當前的 tab 取得 localStorage 的資料。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLocalStorage(): Promise<{[key: string]: any} | undefined> {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return st[0].result ? JSON.parse(st[0].result) as {[key: string]: any} : undefined;
}