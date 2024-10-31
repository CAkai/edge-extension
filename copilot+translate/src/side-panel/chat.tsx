import SendIcon from './public/send.svg?react';
import './chat.css';
import { Message } from './message';
import { useState } from 'react';

const [messages, setMessages] = useState<Message[]>([]);

const MessageBox = () => {
    return (
        <div className="h-5/6">
            <h1>Message Box</h1>
            <ul>
                {messages.map(message => (
                    <li>{message.content}</li>
                ))}
            </ul>
        </div>
    );
};

const MessageInput = () => {
    const [text, setText] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const send = () => {
            messages.push({ role: 'user', content: text });
            setText(''); // 清空輸入框
    };

    return (
        <div className="h-1/6">
            {/* 1px 是因為最外面有 p-1 */}
            <div className="border border-black p-1 rounded w-full h-28 relative">
                <textarea
                    className="text-base w-full h-full"
                    placeholder={chrome.i18n.getMessage('enterText')} value={text} onChange={handleChange}></textarea>
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
