// getLocalStorage 函數會從當前的 tab 取得 localStorage 的資料。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLocalStorage(): Promise<{[key: string]: any} | undefined> {
    const tabs = await getChromeTabs();
    if (!tabs) return;

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

export async function getItemFromLocalStorage(key: string): Promise<string> {
    const result = await getLocalStorage();
    return result?.[key] ?? "";
}

export async function setItemInLocalStorage(key: string, value: string) {
    const tabs = await getChromeTabs();
    if (!tabs) return;

    // Execute script in the current tab
    await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id ?? 0 },
        func: () => {
            localStorage.setItem(key, value);
        }
    });
}

export async function removeItemInLocalStorage(key: string) {
    const tabs = await getChromeTabs();
    if (!tabs) return;

    // Execute script in the current tab
    await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id ?? 0 },
        func: () => {
            localStorage.removeItem(key);
        }
    });
}

async function getChromeTabs() {
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    // 過濾掉 chrome:// 開頭的tab
    tabs = tabs.filter(tab => tab.url && !tab.url.startsWith("chrome://"));

    // 如果沒有找到符合條件的tab，則返回
    if (tabs.length === 0) {
        return null;
    }

    return tabs;
}