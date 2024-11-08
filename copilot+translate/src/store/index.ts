// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action

import { configureStore } from "@reduxjs/toolkit"
import { llmSlice } from "./llm.store"
import { themeSlice } from "./theme.store"
import { userSlice } from "./user.store"
import { useDispatch, useSelector, useStore } from "react-redux"
import { chatSlice } from "./chat.store"
import { messageSlice } from "./message.store"

// 把所有的 reducer 集中在一個地方，透過 combineReducers 來合併
const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        user: userSlice.reducer,
        llm: llmSlice.reducer,
        chat: chatSlice.reducer,
        message: messageSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

// 取得 store 的型別
type AppStore = typeof store

// 定義 dispatch 的型別
type AppDispatch = AppStore['dispatch']

// export 三個 hooks，讓使用者可以直接使用，而不用再 import useDispatch, useSelector, useStore
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export default store