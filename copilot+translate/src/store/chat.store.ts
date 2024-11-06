import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Chat = {
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
}

const initialState: Chat[] = [];

export const getChatList = createAsyncThunk(
    'chat/getList',
    async (token: string) => {
        if (!token) return;
        
        // 到 iCloud 取得使用者資料
        return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .catch((err) => {
                console.error("error", err);
            });
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getChatList.fulfilled, (_, {payload}) => {
            if (!payload) return [];
            return Array.from(payload);
        });
    }
})