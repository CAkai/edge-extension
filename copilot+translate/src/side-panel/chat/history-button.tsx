import { createRef, useState, ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getChatList } from "../../store/chat.store";
import HistoryIcon from '../public/history.svg?react';

// 歷史訊息按鈕，會同步 Open WebUI
export default function HistoryButton() {
    const buttonRef = createRef<HTMLDivElement>();  // 檢查是否點擊在按鈕上
    const dispatch = useAppDispatch();
    const hist = useAppSelector(state => state.chat);
    const user = useAppSelector(state => state.user);
    const [models, setModels] = useState<ReactElement[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // 載入歷史訊息
    useEffect(() => {
        dispatch(getChatList(user.webui_info.token));
    }, [dispatch, user]);

    // 更新歷史訊息列表
    useEffect(() => {
        const selected = hist?.selected ?? '';
        setModels(
            hist?.chats.map((m, i) => (
                <button
                    className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${selected === m.id ? 'bg-gray-200' : ''
                        } hover:bg-gray-100`}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => {
                        dispatch({ type: 'chat/select', payload: m.id });
                        setIsExpanded(false);
                    }}
                    id={`chat-hist-${i}`}>
                    {m.title}
                </button>
            )) ?? [],
        );
    }, [hist, dispatch]);

    // 監聽點擊事件，如果點擊的地方不是在 button 上，就關閉選單
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // e.target 要轉型成 Node，否則會報錯「EventTarget | null is not assignable to type Node」
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [buttonRef]);

    return (
        <div ref={buttonRef} className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-0.5 rounded-md p-1 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isExpanded}
                    aria-haspopup="menu"
                    onClick={() => setIsExpanded(!isExpanded)}>
                    <HistoryIcon style={{ width: '20px', height: '20px' }} />
                    <svg
                        className={`-mr-1 h-5 w-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? '-rotate-180' : ''
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
                className={`absolute right-0 bottom-[2.5rem] z-10 mt-2 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-animation ${isExpanded ? 'scale-on' : 'scale-off'
                    }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}>
                <div role="none">{models}</div>
            </div>
        </div>
    );
}