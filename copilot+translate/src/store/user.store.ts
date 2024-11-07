/**
 * @file user.store.ts
 * @description 類似 Angular 的 Service，統一管理 User 的狀態，讓所有元件都可以存取。
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type OpenWebUIInfo = {

    id: string;
    email: string;
    name: string;
    role: string;
    profile_image_url: string;
    token: string;
    token_type: string;
    expires_at: number;
}

export type User = {
    // access_token 是儲存 iCloud 的 Token，用來認證所有與 iCloud 有關的 API。
    // 如果有人已經登入過 iCloud，則會在 localStorage 中儲存 access_token，那我們就可以從 localStorage 中取得 access_token。
    // 讓使用者不用再次登入。
    access_token: string;
    // 工號
    id: string;
    // 中文名
    name: string;
    // 部門
    department: string;
    // 廠區
    fab: string;
    // 電子郵件，都是 @umc.com
    email: string;
    // 權限角色，目前只有 admin 跟 user 兩種
    role: string;
    // Open WebUI 的登入資訊
    webui_info: OpenWebUIInfo;
};

const initialState: User = {
    access_token: '',
    id: '',
    name: '',
    department: '',
    fab: '',
    email: '',
    role: '',
    webui_info: {
        id: '',
        email: '',
        name: '',
        role: '',
        profile_image_url: '',
        token: '',
        token_type: '',
        expires_at: 0
    }
}

// 當調用 save() 函數時，會把資料同步寫到 chrome.storage.local 以及 localStorage，這樣能讓使用者可以直接登入 iCloud。
export const saveToStorage = createAsyncThunk(
    'user/saveToStorage',
    async (user: User) => {
        void chrome.storage.local.set({ icloudToken: user.access_token });
        localStorage.setItem(import.meta.env.VITE_ICLOUD_STORAGE_KEY, user.access_token);
        return { ...user }
    }
);

// signupWebUI 函數會在使用者第一次登入時，自動註冊 Open WebUI。
// 有可能還沒登入過 Open WebUI，所以要先註冊。
async function signupWebUI(user: User) {
    console.log("正在註冊 Open WebUI...");
    return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/auths/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name,
            email: user.id + "@umc.com",
            password: user.access_token,
            profile_image_url: ""
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.detail) {
                console.error(`無法註冊 Open WebUI，發生了錯誤：${data.detail}`);
                return;
            }
            return data;
        })
        .catch((err) => {
            console.error("error", err);
        });
}

// getLocalStorage 函數會從當前的 tab 取得 localStorage 的資料。
async function getLocalStorage() {
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
    return st[0].result ? JSON.parse(st[0].result) : null;
}

// 調用 load() 函數時，會從 chrome.storage.local 或者 localStorage 取得 iCloud Token。
// 如果有找到 Token，會調用 /api/v1/auth 來取得使用者的資料。
// 如果沒有找到 Token，則會回傳 initialState。
export const loadFromStorage = createAsyncThunk(
    'user/loadFromStorage',
    async (user: User | undefined, { dispatch, getState }) => {
        // 如果沒有傳入 user，表示要直接抓取當前的值，
        // 因此從 getState() 取得 user
        if (!user) {
            const st = getState() as { user: User };
            user = st.user;
        }

        // 如果已經有 access_token 和 webui_token，表示已經登入過了，直接返回
        if (user.access_token && user.webui_info.token) {
            return user;
        }

        // 取得 access_token
        if (!user.access_token) {
            // 從 chrome.storage.local 取得 icloudToken
            const result = await chrome.storage.local.get('icloudToken');
            let token = result.icloudToken;
            // 如果沒有找到 icloudToken，則從 localStorage 取得 icloudToken
            if (!Object.prototype.hasOwnProperty.call(result, 'icloudToken')) {
                const data = await getLocalStorage();
                if (data) {
                    token = data[import.meta.env.VITE_ICLOUD_STORAGE_KEY];
                }
            }

            if (!token) {
                return initialState;
            }

            // 到 iCloud 取得使用者資料
            const resp = await fetch(import.meta.env.VITE_ICLOUD_URL + "api/v1/auth", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        console.error(`連線到 iCloud 時，發生了錯誤：${res.error}`);
                        return {};
                    }

                    console.log("已搜尋到 iCloud Token");
                    return res;
                })
                .catch((err) => {
                    console.error("error", err);
                });

            user = {
                ...user,
                ...resp,
                access_token: token
            } as User;
        }


        // 取得 webui_token
        // 使用 id 以及 access_token 到 Open WebUI 來取得 webui_token
        // 這裡不把 webui_token 存到 chrome.storage.local，因為 webui_token 會在一段時間後過期，所以每次都要重新取得
        if (!user.webui_info.token) {
            console.log("正在自動登入 Open WebUI...");
            let resp = await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/auths/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.id + "@umc.com",
                    password: user.access_token,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.detail) {
                        console.log(`連線到 Open WebUI 時，發生了錯誤：${data.detail}`);
                        return { error: data.detail };
                    }
                    return data;
                })
                .catch((err) => {
                    console.error("error", err);
                });

            if (resp.error) {
                resp = await signupWebUI(user);
                if (!resp) return initialState;
            }

            user = {
                ...user,
                webui_info: {
                    ...resp
                }
            };
        }

        // 將使用者資料存到 chrome.storage.local 以及 localStorage
        dispatch(saveToStorage(user));

        return user;
    });

// ? 參考 https://cn.redux.js.org/tutorials/fundamentals/part-6-async-logic
// ? 建立一個 Async Thunk。當調用 save() 函數時，會把資料同步寫到 chrome.storage.local 以及 localStorage，這樣能讓使用者可以直接登入 iCloud。
// ? 以及調用 load() 函數時，會從 chrome.storage.local 或者 localStorage 取得 iCloud Token。
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        save: (state, action) => {
            return {
                // 設定副本
                ...state,
                // 覆蓋原本的 state
                access_token: action.payload.access_token,
                id: action.payload.id,
                name: action.payload.name,
                department: action.payload.department,
                fab: action.payload.fab,
                email: action.payload.email,
                role: action.payload.role,
                webui_info: {
                    ...action.payload.webui_info
                }
            }
        },
        load: (state) => {
            return {
                ...state,
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // 調用 save 成功後，會回傳新的 state。
            .addCase(saveToStorage.fulfilled, (state, action) => {
                return userSlice.caseReducers.save(state, action);
                
            })
            // 調用 load 成功後，會回傳新的 state。
            .addCase(loadFromStorage.fulfilled, (state, action) => {
                return userSlice.caseReducers.save(state, action);
            })
            .addCase(loadFromStorage.rejected, (state) => {
                return { ...state }
            })
    }
})