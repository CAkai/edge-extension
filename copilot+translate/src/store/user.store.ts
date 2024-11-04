/**
 * @file user.store.ts
 * @description 類似 Angular 的 Service，統一管理 User 的狀態，讓所有元件都可以存取。
 */
import { createSlice, configureStore } from '@reduxjs/toolkit'

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

// 自動生成 Redux action creators
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        save(state = initialState, action) {
            // 這裡要回傳一個新的 state，而不是直接修改原本的 state
            return {
                // 備份原本的 state
                ...state,
                // 覆蓋原本的 state
                ...action.payload
            }
        },
    }
})

// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action
const userStore = configureStore({
    reducer: {
        user: userSlice.reducer,
    }
})

export default userStore