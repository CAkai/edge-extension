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
            state.push(action.payload);
        },
        clearMessage: () => {
            return [];
        },
        updateLastMessage: (state, action) => {
            state[state.length - 1] = action.payload;
        }
    },
})

export const { addMessage, clearMessage, updateLastMessage } = messageSlice.actions;