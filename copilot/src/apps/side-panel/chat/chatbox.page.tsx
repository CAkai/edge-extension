import { createRef, useEffect, useState } from 'react';
import { navStorage } from '../../../libs/navigation';
import HistoryChat from './history-chat.component';
import ModelList from './model-list.component';
import { useMessageStore } from '../../../libs/chat/chat.store';
import MessageBlock from './message.component';
import { DropdownItem } from '../../../components/dropdown.widget';
import { userStorage } from '../../../libs/user';
import { fetchChat, generateChatCompletion } from '../../../libs/chat/chat.api';
import { useStorage } from '../../../packages/storage';
import MessageInput from './message-input.component';
import { NAVIGATION_NAME } from '../../../libs/navigation/navigation.constant';
import { readStream } from '../../../packages/stream';
import { ChatCompletionResponse, OllamaChatCompletionResponse, OpenAIChatCompletionResponse } from '../../../libs/chat/chat.type';
import NewChat from './new-chat.component';
import { LogDebug, LogInfo } from '../../../packages/log';
import { useLlmStore } from '../../../libs/llm';
import { i18n } from '../../../libs/alias';

function scrollToBottom(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'auto', block: 'end' });
}

export default function ChatBox() {
    navStorage.set(NAVIGATION_NAME.SidepanelChat);
    const [model, setModel] = useState<string>('');
    const user = useStorage(userStorage);
    // 因為 hook 只能放在最上層，所以這裡要宣告
    // 否則會出現 invalid hook call
    const { messages, toOpenWebUI, setMessages, addMessage, isWaiting, pending, done, updateLastMessage, lastMessage } =
        useMessageStore();
    const anchorRef = createRef<HTMLDivElement>();
    const selectModel = useLlmStore(state => state.select);

    const ask = async () => {
        const modelInfo = selectModel(model);
        if (!modelInfo) {
            LogInfo('Model not found', model);
            addMessage({ role: 'system-error', content: i18n('modelNotFound_model', model) });
            done();
            return;
        }
        // 先把使用者的訊息轉換成 Open WebUI 的訊息格式
        // 再添加一個空的訊息，讓畫面可以顯示正在輸入中
        // 這樣做是因為傳給 Open WebUI 的最後一個訊息才不會是空的
        const messageInputs = toOpenWebUI(modelInfo.owned_by);
        addMessage({ role: model, content: '' });
        // 這裡要等待 Open WebUI 回傳訊息
        const reader = await generateChatCompletion(user.webui.token, modelInfo.owned_by, {
            model: modelInfo.id,
            stream: true,
            messages: messageInputs,
        });
        // 如果 reader 是 null，代表 Open WebUI 回傳的訊息是空的，
        // 直接顯示錯誤訊息，並通知系統已經完成
        if (!reader) {
            LogInfo('Chat completion response is null');
            addMessage({ role: 'system-error', content: i18n('nullChatResponse') });
            done();
            return;
        }
        // 以 stream 的方式讀取 Open WebUI 回傳的訊息
        for await (const v of readStream<ChatCompletionResponse>(reader)) {
            // 因為 Open WebUI 回傳的訊息格式不同，所以要分開處理
            if (modelInfo.owned_by === 'ollama') {
                const result = v as OllamaChatCompletionResponse;
                updateLastMessage(result.message?.content ?? "");
            }
            else {
                const result = v as OpenAIChatCompletionResponse;
                updateLastMessage(result.choices?.[0]?.delta?.content ?? '');
            }
        }
        LogDebug('lastMessage', lastMessage()?.content);
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
            ask();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, model]);

    // 因為 getChatHistory 有用到 Hook，所以必須在這裡宣告
    const getChatHisotry = async (chat: DropdownItem): Promise<void> => {
        // 取得 chat.id 對應的聊天紀錄
        const history = await fetchChat(user.webui.token, chat.value);
        if (!history) return;
        setMessages(history.chat.messages);
        setModel(history.chat.models[0]);
    };

    return (
        <div className="h-full w-full p-2 flex flex-col justify-between">
            <div className="flex flex-col gap-1 overflow-auto no-scrollbar">
                {messages.map(msg => {
                    const item = { ...msg, id: crypto.randomUUID() };
                    return <MessageBlock message={item} />;
                })}
                {/* 讓網頁能夠定位到最底部 */}
                <div style={{ float: 'left', clear: 'both' }} ref={anchorRef} />
            </div>
            <div className="flex flex-col justify-end">
                <div className="flex justify-between mb-1">
                    <ModelList model={model} onSelect={newModel => setModel(newModel.value)} />
                    <div className="flex gap-1">
                        <HistoryChat onSelect={getChatHisotry} />
                        <NewChat />
                    </div>
                </div>
                <MessageInput />
            </div>
        </div>
    );
}
