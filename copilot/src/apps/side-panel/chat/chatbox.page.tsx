import { createRef, useEffect, useState } from "react";
import { navStorage } from "../../../libs/navigation";
import HistoryChat from "./history-chat.component";
import ModelList from "./model-list.component";
import { useMessageStore } from "../../../libs/chat/chat.store";
import MessageBlock from "./message.component";
import { DropdownItem } from "../../../components/dropdown.widget";
import { userStorage } from "../../../libs/user";
import { fetchChat, generateChatCompletion } from "../../../libs/chat/chat.api";
import { useStorage } from "../../../packages/storage";
import MessageInput from "./message-input.component";
import { NAVIGATION_NAME } from "../../../libs/navigation/navigation.constant";
import { readStream } from "../../../packages/stream";
import { ChatCompletionResponse } from "../../../libs/chat/chat.type";

function scrollToBottom(el: HTMLElement) {
    el.scrollIntoView({ behavior: "auto", block: "end" });
}

export default function ChatBox() {
    navStorage.set(NAVIGATION_NAME.SidepanelChat);
    const [model, setModel] = useState<string>("");
    const user = useStorage(userStorage);
    // 因為 hook 只能放在最上層，所以這裡要宣告
    // 否則會出現 invalid hook call
    const { messages, setMessages, addMessage, isWaiting, pending, done, updateLastMessage } = useMessageStore();
    const anchorRef = createRef<HTMLDivElement>();


    const ask = async () => {
        const reader = await generateChatCompletion(user.webui.token, {
            model: model,
            stream: true,
            messages: messages.map((msg) => {
                return {
                    role: msg.role,
                    content: msg.content,
                }
            }),
        });

        if (!reader) {
            done();
            return;
        }
 
        for await (const v of readStream<ChatCompletionResponse>(reader)) {
            updateLastMessage(v.choices?.[0]?.delta?.content ?? "");
        }
        
        done();

    };

    // 每次 messages 更新後，都要將網頁滾動到最底部
    useEffect(() => {
        scrollToBottom(anchorRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    // 有時候 model 會是空的，無法發送 api，所以要檢查 messages, model
    useEffect(() => {
        if (isWaiting() && model) {
            pending();
            addMessage({ role: model, content: "" });
            ask();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, model]);

    // 因為 getChatHistory 有用到 Hook，所以必須在這裡宣告
    const getChatHisotry = async (chat: DropdownItem): Promise<void> => {
        // 取得 chat.id 對應的聊天紀錄
        const history = await fetchChat(user.webui.token, chat.value);
        if (!history) return;
        console.log(history);
        setModel(history.chat.models[0])
        setMessages(history.chat.messages);
    };

    return (
        <div className="h-full w-full p-2 flex flex-col justify-between">
            <div className="flex flex-col gap-1 overflow-auto no-scrollbar">
                {messages.map((msg) => {
                    const item = { ...msg, id: crypto.randomUUID() };
                    return <MessageBlock message={item} />;
                })}
                {/* 讓網頁能夠定位到最底部 */}
                <div style={{ float:"left", clear: "both" }} ref={anchorRef} />
            </div>
            <div className="flex flex-col justify-end">
                <div className="flex justify-between mb-1">
                    <ModelList model={model} onSelect={(newModel) => setModel(newModel.value)} />
                    <HistoryChat onSelect={getChatHisotry} />
                </div>
                <MessageInput />
            </div>
        </div>
    );
}