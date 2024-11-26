import { create } from "zustand";
import { MessageInfo, Message } from "./chat.type";

export interface MessageState {
    messages: MessageInfo[];
    status: "idle" | "waiting" | "pending";
    done: () => void;
    wait: () => void;
    pending: () => void;
    isIdle: () => boolean;
    isWaiting: () => boolean;
    isPending: () => boolean;
    setMessages: (by: MessageInfo[]) => void;
    addMessage: (by: Message) => void;
    updateLastMessage: (by: string) => void;
    clearMessage: () => void;
    lastMessage: () => MessageInfo | undefined;
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
    addMessage: (by) => set((state) => {
        const newMessage: MessageInfo = {
            id: crypto.randomUUID(),
            timestamp: new Date().getTime(),
            parentId: "",
            chiildrenIds: [],
            files: [],
            info: {
                eval_count: 0,
                eval_duration: 0,
                load_duration: 0,
                prompt_eval_count: 0,
                total_duration: 0,
            },
            ...by,
        };
        return {
            status: get().status,
            messages: [...state.messages, newMessage]
        };
    }),
    updateLastMessage: (by) =>
        set((state) => {
            const nextMessages = [...state.messages];

            if (state.messages.length === 0) return get();

            const newMessage = nextMessages.pop();
            if (!newMessage) return get();
            return { status: get().status, messages: [...nextMessages, { ...newMessage, content: newMessage.content + by }] };
        }),
    clearMessage: () => set(() => ({ status: "idle", messages: [] })),
    lastMessage: () => {
        const messages = get().messages;
        if (messages.length === 0) return undefined;
        return messages[messages.length - 1];
    },
}));