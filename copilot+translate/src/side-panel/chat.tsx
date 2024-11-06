import SendIcon from './public/send.svg?react';
import './chat.css';
import { ReactElement, useEffect, useState } from 'react';
import { loadLlmModels } from '../store/llm.store';
import { useAppDispatch, useAppSelector } from '../store';

function MessageBox() {
    const dispatch = useAppDispatch();
    const llm = useAppSelector(state => state.llm);
    const [models, setModels] = useState<ReactElement[]>([]);

    useEffect(() => {
        console.log('load models');
        dispatch(loadLlmModels());
    }, [dispatch]);

    useEffect(() => {
        setModels(llm?.map(m => <p key={m.id}>{m.name}</p>) ?? []);
    }, [llm]);

    return (
        <div className="h-5/6">
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

    const send = () => {
        setText(''); // 清空輸入框
    };

    return (
        <div className="h-1/6">
            {/* 1px 是因為最外面有 p-1 */}
            <div className="border border-black p-1 rounded w-full h-28 relative">
                <textarea
                    className="text-base w-full h-full"
                    placeholder={chrome.i18n.getMessage('enterText')}
                    value={text}
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
        <div className="h-full w-full">
            <MessageBox />
            <MessageInput />
        </div>
    );
}
