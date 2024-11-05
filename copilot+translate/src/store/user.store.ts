/**
 * @file user.store.ts
 * @description 類似 Angular 的 Service，統一管理 User 的狀態，讓所有元件都可以存取。
 */
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

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
};

const initialState: User = {
    access_token: '',
    id: '',
    name: '',
    department: '',
    fab: '',
    email: '',
    role: ''
}

// 當調用 save() 函數時，會把資料同步寫到 chrome.storage.local 以及 localStorage，這樣能讓使用者可以直接登入 iCloud。
export const saveToStorage = createAsyncThunk(
    'user/saveToStorage',
    async (user: User) => {
        void chrome.storage.local.set({ icloudToken: user.access_token });
        localStorage.setItem(import.meta.env.VITE_ICLOUD_STORAGE_KEY, user.access_token);
        return { ...user }
    });


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
    async (_, { dispatch, getState }) => {
        // 如果已經有 access_token，表示已經登入過了，直接返回
        const {user} = getState() as UserState;
        if (user.access_token) {
            return user;
        }

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

                console.log("搜尋到 iCloud Token，正在自動登入...");
                return {
                    ...res,
                    access_token: token
                };
            })
            .catch((err) => {
                console.error("error", err);
            });
        dispatch(saveToStorage(resp));
        return resp as User
    });

// ? 參考 https://cn.redux.js.org/tutorials/fundamentals/part-6-async-logic
// ? 建立一個 Async Thunk。當調用 save() 函數時，會把資料同步寫到 chrome.storage.local 以及 localStorage，這樣能讓使用者可以直接登入 iCloud。
// ? 以及調用 load() 函數時，會從 chrome.storage.local 或者 localStorage 取得 iCloud Token。
const userSlice = createSlice({
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
                role: action.payload.role
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
                    role: action.payload.role
                }
            })
            // 調用 load 成功後，會回傳新的 state。
            .addCase(loadFromStorage.fulfilled, (state, action) => {
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
                    role: action.payload.role
                }
            })
            .addCase(loadFromStorage.rejected, (state) => {
                return { ...state }
            })
    }
})

// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action
const userStore = configureStore({
    reducer: {
        user: userSlice.reducer,
    }
})

// UserState 要記得下 export 來提供 slices 使用
export type UserState = ReturnType<typeof userStore.getState>

export default userStore