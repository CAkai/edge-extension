import { useEffect, useState } from 'react';
import SendIcon from '../../../../public/svg/send.svg?react';
import { useMessageStore } from '../../../libs/chat/chat.store';
import { getThemeProps, themeStorage } from '../../../libs/theme';
import { useStorage } from '../../../packages/storage';
import { getImageData } from '../../../libs/file/file.util';
import { downloadFile } from '../../../libs/file/file.api';
import { i18n } from '../../../libs/alias';
import { chromeNotify } from '../../../packages/chrome/notification';
import { ContextMenuOption } from '../../server/contextmenu.service';
import { ChatFile } from '../../../libs/chat/chat.type';
import ImageButton from '../../../components/image-button.component';
import FileButton from '../../../components/file-button.component';

export default function MessageInput() {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<ChatFile[]>([]);
    const { addMessage, wait, isIdle, clearMessage } = useMessageStore();
    const theme = getThemeProps(useStorage(themeStorage));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const send = (text: string) => {
        addMessage({
            role: 'user',
            content: text,
            images: attachments.filter(e => e.type === 'image'),
        });
        setAttachments([]);
        wait();
    };

    // 監聽右鍵選單的事件
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleContextMenuEvent = (request: { type: string; value: string }, _: any, sendResponse: any) => {
            if (!request) return;
            clearMessage();
            // sendResponse 一定要寫，不然會跳「 The message port closed before a response was received.」
            switch (request.type) {
                case 'clipboard':
                    send(request.value);
                    sendResponse('已貼上至 Side Panel');
                    break;
                case 'upload-image': {
                    const { fileName, fileType } = getImageData(request.value);
                    downloadFile(request.value, fileName, fileType)
                        // 使用 Promise 來等待圖片上傳完成
                        .then(
                            file =>
                                new Promise((resolve, reject) => {
                                    {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result);
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                    }
                                }),
                        )
                        .then(dataURL => {
                            if (!dataURL) return Promise.reject('no dataURL');
                            setAttachments(prev => [...prev, { type: 'image', url: dataURL as string }]);
                        })
                        // 發生錯誤就跳通知
                        .catch(() =>
                            chromeNotify(
                                'error',
                                `${ContextMenuOption.UPLOAD_IMAGE_TO_CHAT}-${crypto.randomUUID()}`,
                                i18n('uploadImageToChat'),
                                i18n('uploadFailed'),
                            ),
                        );
                    // 一定要發送訊息，不然會跳「 The message port closed before a response was received.」
                    sendResponse('已上傳圖片至 Side Panel');
                    break;
                }
                default:
                    break;
            }
        };

        chrome.runtime.onMessage.addListener(handleContextMenuEvent);

        return () => {
            chrome.runtime.onMessage.removeListener(handleContextMenuEvent);
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
        <div className={`rounded-lg border ${theme.inputBorderColor} w-full relative`}>
            {attachments.length > 0 && (
                <div className="mx-1 mt-2.5 mb-1 flex flex-wrap gap-2">
                    {attachments.map(e => {
                        switch (e.type) {
                            case 'image':
                                return (
                                    <ImageButton
                                        src={e.url}
                                        alt="input"
                                        onClick={() => {
                                            const nextAttachments = attachments.filter(a => a.url !== e.url);
                                            setAttachments(nextAttachments);
                                        }}
                                    />
                                );
                            case 'file':
                                return <FileButton name={e.name} size={e.size} />;
                            default:
                                return null;
                        }
                    })}
                </div>
            )}
            <textarea
                // 這邊加 bg-transparent 是因為 textarea 會有一個預設的背景色，這樣會切到 border 的四個角
                className="overflow-hidden text-base w-full min-h-24 max-h-28 px-2 py-1 bg-transparent"
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
    );
}
