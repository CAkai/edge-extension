// getLocalStorage 函數會從當前的 tab 取得 localStorage 的資料。
// 一開始是直接操作 localStorage，如果失敗才會用 chrome.scripting.executeScript 去操作。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLocalStorage(): Promise<{ [key: string]: any } | undefined> {
    try {
        if (typeof window === 'undefined' || Object.keys(localStorage).length === 0) {
            throw new Error("localStorage is not available");
        }
        console.log(1);
        return localStorage;
    }
    catch {
        console.log(2);
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
        return st[0].result ? JSON.parse(st[0].result) as { [key: string]: any } : undefined;
    }
}

// getItemFromLocalStorage 函數會從 localStorage 取得指定 key 的資料。
export async function getItemFromLocalStorage(key: string): Promise<string> {
    // 記得要去除字串中的雙引號。但 replace 會只取代第一個符合的字串，所以要用正規表達式。
    const result = await getLocalStorage();
    return result?.[key]?.replace(/"/g, "") ?? "";
}

export async function setItemInLocalStorage(key: string, value: string) {
    try {
        if (typeof window === 'undefined' || Object.keys(localStorage).length === 0) {
            throw new Error("localStorage is not available");
        }
        localStorage.setItem(key, value);
    }
    catch {
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
}

export async function removeItemInLocalStorage(key: string) {
    try {
        if (typeof window === 'undefined' || Object.keys(localStorage).length === 0) {
            throw new Error("localStorage is not available");
        }
        localStorage.removeItem(key);
    }
    catch {
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