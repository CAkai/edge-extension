import { useState, ReactElement, createRef, useEffect } from "react";
import { useAppSelector } from "../../store";
import LoadingIcon from "./loading";

export default function MessageBox() {
    const messages = useAppSelector(state => state.message);
    const [messageList, setMessageList] = useState<ReactElement[]>([]);
    const messagesEndRef = createRef<HTMLDivElement>();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setMessageList(
            messages.map((m, i) => (
                <div key={i} className={`p-1 flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {m.role === 'user' ? false : <p>{m.role}</p>}
                    <div
                        className={`p-2 rounded-lg w-fit max-w-[95%] text-base ${m.role === 'user' ? 'bg-gray-200' : 'bg-slate-50'
                            }`}>
                        {m.content === '' ? <LoadingIcon /> : m.content}
                    </div>
                </div>
            )),
        );
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col gap-1 overflow-auto no-scrollbar">
            {messageList}
            {/* 讓網頁能夠定位到最底部 */}
            <div ref={messagesEndRef} />
        </div>
    );
}