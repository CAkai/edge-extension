import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";

// ChatBase 是 Open WebUI 的聊天室基本資料，用在左側面板的對話歷史列表
export type ChatBase = {
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
}

type ChatUsage = {
    eval_count: number;
    eval_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    total_duration: number;
};

type ChatMessage = {
    id: string;
    role: string;
    content: string;
    timestamp: number;
    parentId: string;
    chiildrenIds: string[];
    model?: string;
    info: ChatUsage;
    modelIdx?: number;
    modelName?: string;
    models?: string[];
    context?: string;
    done?: boolean;
    userContext?: string;
}

type ChatContent = {
    files: string[];
    models: string[];
    messages: ChatMessage[];
    history: {
        currentId: string;
        messages: { [key: string]: ChatMessage };
    }
}

type ChatDataMeta = {
    tags: string[];
}

// ChatData 是 Open WebUI 的聊天室完整資料，包含聊天室的訊息、檔案、標籤等等
export type ChatData = {
    archived: boolean;
    user_id: string;
    id: string;
    title: string;
    updated_at: number;
    created_at: number;
    pinned: boolean;
    share_id: string;
    folder_id: string;
    timestamp: number;
    tags: string[];
    meta: ChatDataMeta;
    chat: ChatContent;
}

const initialState: { selected: string; chats: ChatBase[] } = {
    selected: "",
    chats: [],
}

export const getChatList = createAsyncThunk(
    'chat/getList',
    async (token: string, { getState }) => {
        const state = getState() as { chat: { selected: string; models: ChatBase[] } };

        if (!token) return;

        // 到 iCloud 取得使用者資料
        return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/chats/list", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json() as Promise<ChatBase[]>)
            .then((data) => {
                if (data.length > 0) {
                    return {
                        selected: state.chat.selected,
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
        builder.addCase(getChatList.fulfilled, (state, { payload }) => {
            if (!payload) return { ...state }
            return {
                ...state,
                selected: payload.selected,
                chats: payload.models
            }
        });
    }
})


export async function fetchChat(token: string, id: string, dispatch: Dispatch) {
    if (!token || !id) return;
    return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + `api/v1/chats/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json() as Promise<ChatData>)
        .then((res) => {
            // console.log("chat", res);
            // 清空訊息
            dispatch({ type: 'message/clearMessage' });
            // 匯入訊息
            res.chat.messages.map((msg) => {
                dispatch({ type: 'message/addMessage', payload: {role: msg.role, content: msg.content} });
            });
            // 設定模型
            dispatch({ type: 'llm/selectModel', payload: res.chat.models[0] });
        })
        .catch((err) => {
            console.error("error", err);
        });
}