import { create } from "zustand";
import { MessageInfo, Message, OpenAIMessage, OllamaMessage, OpenAIMessageContent } from "./chat.type";

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
    toOpenWebUI: (own_by: string) => OpenAIMessage[] | OllamaMessage[];
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
        // 建立新的 MessageInfo
        const newMessage: MessageInfo = {
            ...by,
            id: crypto.randomUUID(),
            timestamp: new Date().getTime(),
            parentId: "",
            chiildrenIds: [],
            files: by.images?.map(e => ({ type: "image", url: e })) ?? [],
            info: {
                eval_count: 0,
                eval_duration: 0,
                load_duration: 0,
                prompt_eval_count: 0,
                total_duration: 0,
            },
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
    toOpenWebUI: (own_by) => {
        // 取得非系統錯誤的訊息
        const messages = get().messages.filter(e => e.role !== "system-error");
        // 依照 owned_by 來轉換成對應的訊息格式
        return messages.map((msg) => {
            const role = msg.role !== "user" ? "assistant" : "user";
            if (msg.files && msg.files.length > 0) {
                switch (own_by) {
                    case "openai":
                        return {
                            role: role,
                            content: [
                                {
                                    type: "text",
                                    text: msg.content,
                                },
                                ...msg.files.filter(e => e.type === "image").map(e => ({
                                    type: "image_url",
                                    image_url: {
                                        url: e.url,
                                    }
                                })),
                            ] as OpenAIMessageContent[]
                        };
                    case "ollama": {
                        const baseMessage: OllamaMessage = {
                            role: role,
                            content: msg.content,
                        }
                        const imageUrls = msg.files
                        .filter(e => e.type === "image")
                        .map(e => e.url.slice(e.url.indexOf(",") + 1));
                        if (imageUrls.length > 0 && role === "user") {
                            baseMessage.images = imageUrls;
                        }
                        return baseMessage;
                    }
                    default:
                        return {
                            role: role,
                            content: msg.content,
                        }
                }
            }
            else return {
                role: role,
                content: msg.content
            }
        });
    }
}));