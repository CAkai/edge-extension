import { createSlice, configureStore } from '@reduxjs/toolkit'

const initialState: "light" | "dark" = "light"

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle(state, action) {
      action.payload = state === "light" ? "dark" : "light"
    }
  } 
})

// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action
const themeStore = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    }
})

export default themeStore