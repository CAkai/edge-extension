import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Chat = {
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
}

const initialState: {selected: string; chats: Chat[]} = {
    selected: "",
    chats: [],
}

export const getChatList = createAsyncThunk(
    'chat/getList',
    async (token: string, {getState}) => {
        const state = getState() as { chat: { selected: string; models: Chat[] } };

        if (!token) return;

        // 到 iCloud 取得使用者資料
        return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/chats/list", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json() as Promise<Chat[]>)
            .then((data) => {
                if (data.length > 0) {
                    return {
                        selected: data[0].id,
                        models: data,
                    }
                } else {
                    return state.chat;
                }
            })
            .catch((err) => {
                console.error("error", err);
                return state.chat;
            });
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        select: (state, action) => {
            state.selected = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getChatList.fulfilled, (state, {payload}) => {
            if (!payload) return {...state}
            return {
                ...state,
                selected: payload.selected,
                chats: payload.models
            }
        });
    }
})