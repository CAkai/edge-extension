import SendIcon from './public/send.svg?react';
import LlmIcon from './public/model.svg?react';
import './chat.css';
import { ReactElement, useEffect, useState } from 'react';
import { loadLlmModels } from '../store/llm.store';
import { useAppDispatch, useAppSelector } from '../store';

function MessageBox() {
    return (
        <div className="h-5/6 border border-black">
            <h1>Message Box</h1>
        </div>
    );
}

function ModelButton() {
    const dispatch = useAppDispatch();
    const llm = useAppSelector(state => state.llm);
    const user = useAppSelector(state => state.user);
    const [models, setModels] = useState<ReactElement[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        dispatch(loadLlmModels(user.webui_info.token));
    }, [dispatch, user]);

    useEffect(() => {
        setModels(
            llm?.map(m => (
                <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="menu-item-0">
                    {m.name}
                </a>
            )) ?? [],
        );
    }, [llm]);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-0.5 rounded-md bg-white p-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                className={`absolute left-0 bottom-[2.5rem] z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-animation ${isExpanded ? 'scale-on' : 'scale-off'}`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}>
                <div className="py-1" role="none">
                    {models}
                </div>
            </div>
        </div>
    );
}

const MessageInput = () => {
    const [text, setText] = useState('');

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

    const send = () => {
        setText(''); // 清空輸入框
    };

    return (
        <div className="h-1/6 flex flex-col justify-end">
            <div>
                <ModelButton />
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
        <div className="h-full w-full p-2">
            <MessageBox />
            <MessageInput />
        </div>
    );
}
