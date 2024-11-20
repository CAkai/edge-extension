import { useEffect, useState } from "react";
import SendIcon from "../../../../public/svg/send.svg?react";
import { useMessageStore } from "../../../libs/chat/chat.store";

export default function MessageInput() {
    const [text, setText] = useState('');
    const {addMessage, wait, isIdle} = useMessageStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const send = (text: string) => {
        addMessage({ role: 'user', content: text });
        wait();
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

    return (
        <div className="rounded-lg border border-black w-full h-28 relative">
            <textarea
                // 這邊加 bg-transparent 是因為 textarea 會有一個預設的背景色，這樣會切到 border 的四個角
                className="overflow-hidden text-base w-full h-full px-2 py-1 bg-transparent"
                placeholder={chrome.i18n.getMessage('enterText')}
                disabled={!isIdle()}
                value={text}
                onKeyDown={handleKeyDown}
                onChange={handleChange}></textarea>
            <button
                className="absolute bottom-1 right-1"
                disabled={!isIdle()}
                onClick={() => {
                    send(text);
                    setText(''); // 清空輸入框
                }}>
                <SendIcon style={{ width: '20px', height: '20px' }} />
            </button>
        </div>
    )
}