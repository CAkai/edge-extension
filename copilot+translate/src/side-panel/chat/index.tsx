import "./index.css"
import MessageInput from "./message-input";
import MessageBox from "./message-box";

export default function Chat() {
    // 標記目前在 Chat 組件，原因是 background 和 side-panel 讀不到 store，所以要透過 chrome.storage 來儲存
    void chrome.storage.local.set({ isInChat: true });
    return (
        <div className="h-full w-full p-2 flex flex-col justify-between">
            <MessageBox />
            <MessageInput />
        </div>
    );
}
