import { useState, useEffect } from "react";
import { useStore } from "react-redux";
import { useAppDispatch, useAppSelector, RootState } from "../../store";
import { ChatRequest } from "../../store/message";
import HistoryButton from "./history-button";
import ModelButton from "./model-button";
import SendIcon from '../public/send.svg?react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateChatCompletion = async (token: string = '', body: ChatRequest, dispatch: any) => {
    // 這裡一定要先加入一個空的訊息，否則會有畫面卡住的問題。
    // 而且還要用副本，否則會跳出 Readonly 的錯誤
    dispatch({ type: 'message/addMessage', payload: { role: body.model, content: "" } });

    await fetch(`${import.meta.env.VITE_OPEN_WEBUI_URL}api/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(response => {
        if (response.ok && response.body) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

            const newMessage = {
                role: body.model,
                content: "",
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const readStream: any = () =>
                reader.read().then(({ value, done }) => {
                    if (done) {
                        reader.cancel();
                        return Promise.resolve();
                    }

                    // parse the data
                    const data = /{.*}/.exec(value);
                    if (!data || !data[0]) {
                        return readStream();
                    }

                    const res = JSON.parse(data[0]);
                    newMessage.content += res?.choices?.[0]?.delta?.content ?? '';
                    // 用副本更新內容，否則會跳出 Readonly 的錯誤
                    dispatch({ type: 'message/updateLastMessage', payload: { ...newMessage } });

                    // do something if success
                    // and cancel the stream
                    // reader.cancel().catch(() => null);

                    return readStream();
                });
            return readStream();
        } else {
            return Promise.reject(response);
        }
    });
};

export default function MessageInput() {
    const [text, setText] = useState('');
    const store = useStore();
    const dispatch = useAppDispatch();
    const selectedModel = useAppSelector(state => state.llm.selected);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    // 檢驗是否按下 Enter 鍵或者 shift + Enter 鍵
    // 如果是 Enter 鍵，就送出訊息
    // 如果是 shift + Enter 鍵，就換行
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(text);
            setText(''); // 清空輸入框
        }
        // 因為 shift + Enter 預設就是換行，所以這邊不需要做任何事情
    };

    // 送出訊息的動作函數
    const send = async (input: string) => {
        // 先寫入訊息，再讀取資料，才能取得最新的訊息
        dispatch({ type: 'message/addMessage', payload: { role: 'user', content: input } });
        const st = store.getState() as RootState;
        await generateChatCompletion(
            st.user.webui_info.token,
            {
                model: st.llm.selected,
                stream: true,
                messages: st.message.map(m => ({ role: m.role === 'user' ? 'user' : 'system', content: m.content })),
            },
            dispatch,
        );
    };

    // 監聽右鍵選單的事件
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleClipboard = (request: { type: string; value: string }, _: any, sendResponse: any) => {
            if (request && request.type === 'clipboard') {
                send(request.value);
                sendResponse('已貼上至 Side Panel'); // 這個一定要寫，不然會跳「 The message port closed before a response was received.」
            }
        };

        chrome.runtime.onMessage.addListener(handleClipboard);

        return () => {
            chrome.runtime.onMessage.removeListener(handleClipboard);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col justify-end">
            <div className="flex justify-between mb-1">
                <div className="flex gap-1 items-center">
                    <ModelButton />
                    <p>{selectedModel}</p>
                </div>
                <HistoryButton />
            </div>
            <div className="rounded-lg border border-black w-full h-28 relative">
                <textarea
                    // 這邊加 bg-transparent 是因為 textarea 會有一個預設的背景色，這樣會切到 border 的四個角
                    className="overflow-hidden text-base w-full h-full px-2 py-1 bg-transparent"
                    placeholder={chrome.i18n.getMessage('enterText')}
                    value={text}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}></textarea>
                <button
                    className="absolute bottom-1 right-1"
                    onClick={() => {
                        send(text);
                        setText(''); // 清空輸入框
                    }}>
                    <SendIcon style={{ width: '20px', height: '20px' }} />
                </button>
            </div>
        </div>
    );
};