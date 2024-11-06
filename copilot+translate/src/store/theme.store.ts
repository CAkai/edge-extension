import { createSlice } from '@reduxjs/toolkit'

const initialState: "light" | "dark" = "light"

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle(state, action) {
      action.payload = state === "light" ? "dark" : "light"
    }
  } 
})