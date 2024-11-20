import { create } from "zustand";
import { Message } from "./chat.type";

export interface MessageState {
    messages: Message[];
    status: "idle" | "waiting" | "pending";
    done: () => void;
    wait: () => void;
    pending: () => void;
    isIdle: () => boolean;
    isWaiting: () => boolean;
    isPending: () => boolean;
    setMessages: (by: Message[]) => void;
    addMessage: (by: Message) => void;
    updateLastMessage: (by: string) => void;
    clearMessage: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
    messages: [],
    status: "idle",
    done: () => set((state) => ({ ...state, status: "idle" })),
    wait: () => set((state) => ({ ...state, status: "waiting" })),
    pending: () => set((state) => ({ ...state, status: "pending" })),
    isIdle: () => get().status === "idle",
    isWaiting: () => get().status === "waiting",
    isPending: () => get().status === "pending",

    setMessages: (by) => set(() => ({ status: "idle", messages: [...by] })),
    addMessage: (by) => set((state) => ({ status: get().status, messages: [...state.messages, by] })),
    updateLastMessage: (by) =>
        set((state) => {
            const nextMessages = [...state.messages];

            if (state.messages.length === 0) return get();

            const newMessage = nextMessages.pop();
            if (!newMessage) return get();
            return { status: get().status, messages: [...nextMessages, { role: newMessage.role, content: newMessage.content + by }] };
        }),
    clearMessage: () => set(() => ({ status: "idle", messages: [] })),
}));