import { createRef, useState, ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { loadLlmModels } from "../../store/llm.store";
import LlmIcon from '../public/model.svg?react';

// 模型選擇按鈕
export default function ModelButton() {
    const buttonRef = createRef<HTMLDivElement>();
    const dispatch = useAppDispatch();
    const llm = useAppSelector(state => state.llm);
    const user = useAppSelector(state => state.user);
    const [models, setModels] = useState<ReactElement[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // 載入模型列表
    useEffect(() => {
        dispatch(loadLlmModels(user.webui_info.token));
    }, [dispatch, user]);

    // 更新模型列表
    useEffect(() => {
        const selectedModel = llm?.selected ?? '';
        setModels(
            llm?.models.map((m, i) => (
                <button
                    className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${selectedModel === m.id ? 'bg-gray-200' : ''
                        } hover:bg-gray-100`}
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => {
                        dispatch({ type: 'llm/selectModel', payload: m.id });
                        setIsExpanded(false);
                    }}
                    id={`menu-item-${i}`}>
                    {m.name}
                </button>
            )) ?? [],
        );
    }, [llm, dispatch]);

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
                    <LlmIcon style={{ width: '20px', height: '20px' }} />
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
                className={`absolute left-0 bottom-[2.5rem] z-10 mt-2 w-56 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-animation ${isExpanded ? 'scale-on' : 'scale-off'
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