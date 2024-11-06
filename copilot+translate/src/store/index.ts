// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action

import { configureStore } from "@reduxjs/toolkit"
import { llmSlice } from "./llm.store"
import { themeSlice } from "./theme.store"
import { userSlice } from "./user.store"
import { useDispatch, useSelector, useStore } from "react-redux"

// 把所有的 reducer 集中在一個地方，透過 combineReducers 來合併
const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
        user: userSlice.reducer,
        llm: llmSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

// Get the type of our store variable
type AppStore = typeof store

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = AppStore['dispatch']

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

export default store