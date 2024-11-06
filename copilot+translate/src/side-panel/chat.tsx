import SendIcon from './public/send.svg?react';
import './chat.css';
import { ReactElement, useEffect, useState } from 'react';
import { loadLlmModels } from '../store/llm.store';
import { useAppDispatch, useAppSelector } from '../store';

function MessageBox() {
    const dispatch = useAppDispatch();
    const llm = useAppSelector(state => state.llm);
    const user = useAppSelector(state => state.user);
    const [models, setModels] = useState<ReactElement[]>([]);

    useEffect(() => {
        console.log(user);
        dispatch(loadLlmModels(user.webui_info.token));
    }, [dispatch, user]);

    useEffect(() => {
        setModels(llm?.map(m => <p key={m.id}>{m.name}</p>) ?? []);
    }, [llm]);

    return (
        <div className="h-5/6 border border-black">
            <h1>Message Box</h1>
            <p>{import.meta.env.VITE_ICLOUD_URL}</p>
            {models}
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
            <div>Message Tools</div>
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
