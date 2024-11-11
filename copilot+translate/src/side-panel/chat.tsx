import SendIcon from './public/send.svg?react';
import LlmIcon from './public/model.svg?react';
import './chat.css';
import React, { createRef, ReactElement, useEffect, useState } from 'react';
import { loadLlmModels } from '../store/llm.store';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { useStore } from 'react-redux';
import { GenerateRequest } from '../store/message.store';

function MessageBox() {
    const messages = useAppSelector(state => state.message);
    const [messageList, setMessageList] = useState<ReactElement[]>([]);
    const messagesEndRef = createRef<HTMLDivElement>();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }

    useEffect(() => {
        setMessageList(
            messages.map((m, i) => (
                <div key={i} className={`p-1 flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {m.role === 'user' ? false : <p>{m.role}</p>}
                    <div
                        className={`p-2 rounded-lg w-fit max-w-[95%] ${
                            m.role === 'user' ? 'bg-gray-200' : 'bg-slate-50'
                        }`}>
                        {m.content}
                    </div>
                </div>
            )),
        );
        scrollToBottom();
    }, [messages]);

    return <div className="flex flex-col gap-1 overflow-auto">
        {messageList}
        {/* 讓網頁能夠定位到最底部 */}
        <div ref={messagesEndRef} />
        </div>;
}

function ModelButton() {
    const buttonRef = createRef<HTMLDivElement>();
    const dispatch = useAppDispatch();
    const llm = useAppSelector(state => state.llm);
    const user = useAppSelector(state => state.user);
    const [models, setModels] = useState<ReactElement[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // 載入模型列表
    useEffect(() => {
        dispatch(loadLlmModels(user.webui_info.token));
    }, [dispatch, user]);

    // 更新模型列表
    useEffect(() => {
        const selectedModel = llm?.selected ?? "";
        setModels(
            llm?.models.map((m, i) => (
                <button
                    className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${selectedModel === m.id ? 'bg-gray-200' : ''} hover:bg-gray-100`}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => {
                        dispatch({ type: 'llm/selectModel', payload: m.id });
                        setIsExpanded(false);
                    }}
                    id={`menu-item-${i}`}>
                    {m.name}
                </button>
            )) ?? [],
        );
    }, [llm, dispatch]);

    // 監聽點擊事件，如果點擊的地方不是在 button 上，就關閉選單
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // e.target 要轉型成 Node，否則會報錯「EventTarget | null is not assignable to type Node」
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [buttonRef]);

    return (
        <div ref={buttonRef} className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-0.5 rounded-md p-1 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isExpanded}
                    aria-haspopup="menu"
                    onClick={() => setIsExpanded(!isExpanded)}>
                    <LlmIcon style={{ width: '20px', height: '20px' }} />
                    <svg
                        className={`-mr-1 h-5 w-5 text-gray-400 transform transition-transform duration-300 ${
                            isExpanded ? '-rotate-180' : ''
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon">
                        <path
                            fill-rule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={`absolute left-0 bottom-[2.5rem] z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-animation ${
                    isExpanded ? 'scale-on' : 'scale-off'
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}>
                <div role="none">
                    {models}
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateChatCompletion = async (token: string = '', body: GenerateRequest, dispatch: any) => {
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
                content: '',
            };
            
            // 這裡一定要先加入一個空的訊息，否則會有畫面卡住的問題。
            // 而且還要用副本，否則會跳出 Readonly 的錯誤
            dispatch({ type: 'message/addMessage', payload: {...newMessage} });

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
                    newMessage.content += res?.choices?.[0]?.delta?.content ?? "";
                    // 用副本更新內容，否則會跳出 Readonly 的錯誤
                    dispatch({ type: 'message/updateLastMessage', payload: {...newMessage} });

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

const MessageInput = () => {
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
            send();
        }
        // 因為 shift + Enter 預設就是換行，所以這邊不需要做任何事情
    };

    const send = async () => {
        const st = store.getState() as RootState;
        dispatch({ type: 'message/addMessage', payload: { role: 'user', content: text } });

        void generateChatCompletion(
            st.user.webui_info.token,
            {
                model: st.llm.selected,
                stream: true,
                messages: [
                    {
                        role: 'user',
                        content: text,
                    },
                ],
            },
            dispatch,
        );

        setText(''); // 清空輸入框
    };

    return (
        <div className="flex flex-col justify-end">
            <div className="flex gap-1 items-center">
                <ModelButton />
                <p>{selectedModel}</p>
            </div>
            <div className="rounded-lg border border-black w-full h-28 relative">
                <textarea
                    // 這邊加 bg-transparent 是因為 textarea 會有一個預設的背景色，這樣會切到 border 的四個角
                    className="overflow-hidden text-base w-full h-full px-2 py-1 bg-transparent"
                    placeholder={chrome.i18n.getMessage('enterText')}
                    value={text}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}></textarea>
                <button className="absolute bottom-1 right-1" onClick={send}>
                    <SendIcon style={{ width: '20px', height: '20px' }} />
                </button>
            </div>
        </div>
    );
};

export default function Chat() {
    return (
        <div className="h-full w-full p-2 flex flex-col justify-between">
            <MessageBox />
            <MessageInput />
        </div>
    );
}
