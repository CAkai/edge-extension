import { createSlice } from "@reduxjs/toolkit";

export interface GenerateRequest {
    model: string
    stream: boolean
    messages: Message[]
}

export interface Message {
    role: string
    content: string
    images?: Uint8Array[] | string[]
    tool_calls?: ToolCall[]
}

interface ToolCall {
    function: {
        name: string;
        arguments: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        };
    };
}

const initialState: Message[] = [];

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const newState = Array.from(state);
            newState.push(action.payload);
            return newState;
        },
        clearMessage: () => {
            return [];
        },
        updateLastMessage: (state, action) => {
            const newState = Array.from(state);
            newState.pop();
            newState.push(action.payload);
            return newState;
        }
    },
})

export const { addMessage, clearMessage, updateLastMessage } = messageSlice.actions;