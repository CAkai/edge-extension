const MessageBox = () => {
    return (
        <div className="h-5/6">
            <h1>Message Box</h1>
        </div>
    );
}

const MessageInput = () => {
    return (
        <div className="h-1/6">
            {/* 1px 是因為最外面有 p-1 */}
            <textarea className="w-full h-28 rounded border border-black p-1 text-base" placeholder={chrome.i18n.getMessage("enterText")}></textarea>
        </div>
    );
}

export default function Chat() {
    return (
        <div className="h-full w-full">
            <MessageBox />
            <MessageInput />
        </div>
    );
}