import SendIcon from './public/send.svg?react';

const MessageBox = () => {
    return (
        <div className="h-5/6">
            <h1>Message Box</h1>
        </div>
    );
};

const MessageInput = () => {
    return (
        <div className="h-1/6">
            {/* 1px 是因為最外面有 p-1 */}
            <div className="border border-black p-1 rounded w-full h-28 relative">
                <textarea
                    className="text-base w-full h-full"
                    style={{ resize: 'none' }}
                    placeholder={chrome.i18n.getMessage('enterText')}></textarea>
                <button className="absolute bottom-1 right-1">
                    <SendIcon style={{width: "20px", height: "20px"}} />
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
