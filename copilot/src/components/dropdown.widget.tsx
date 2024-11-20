import React, { createRef, useState, useEffect } from "react";
import "./dropdown.widget.css";

export type DropdownItem = {
    id: string;
    label: string;
    value: string;
}

type DropdownProps = {
    items: DropdownItem[];
    direction: "tr" | "br" | "tl" | "bl";
    className?: string;
    children?: React.ReactNode;
    selected?: DropdownItem;
    width?: string;
    height?: string;
    onSelect?: (item: DropdownItem) => void;
}

// 下拉式列表的展開方向
const ANIMA_DIRECTION = {
    tr: "origin-bottom-left",
    br: "origin-top-left",
    tl: "origin-bottom-right",
    bl: "origin-top-right",
}

// 下拉式列表的位置
const DROPDOWN_ORIGIN = {
    tr: "left-0 bottom-[1.5rem]",
    tl: "right-0 bottom-[1.5rem]",
    br: "left-0 top-[1.5rem]",
    bl: "right-0 top-[1.5rem]",
}

export default function Dropdown({ items, selected, direction, className="",children, width="fit-content", height="200px", onSelect }: DropdownProps) {
    const clickOutsideRef = createRef<HTMLDivElement>();
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected ?? items[0]);

    // 更新 selected item，否則畫面會顯示不正確
    useEffect(() => {
        setSelectedItem(selected ?? items[0]);
    }, [selected, items]);

    // 監聽點擊事件，如果點擊的地方不是在 button 上，就關閉選單
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // e.target 要轉型成 Node，否則會報錯「EventTarget | null is not assignable to type Node」
            if (clickOutsideRef.current && !clickOutsideRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [clickOutsideRef]);

    return (
        <div ref={clickOutsideRef} className={`relative inline-block text-left ${className}`}>
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-0.5 rounded-md p-1 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isExpanded}
                    aria-haspopup="menu"
                    onClick={() => setIsExpanded(!isExpanded)}>
                    {children}
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
                style={{ width: width, maxHeight: height }}
                className={`absolute ${DROPDOWN_ORIGIN[direction]} z-10 mt-2 ${ANIMA_DIRECTION[direction]} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scale-animation ${isExpanded ? 'scale-on' : 'scale-off'
                    }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}>
                <div role="none">
                    {items.map(item => {
                        return (
                            <button
                                className={`w-full text-left block whitespace-nowrap overflow-hidden overflow-ellipsis px-4 py-2 text-sm text-gray-700 ${selectedItem?.value === item.value ? 'bg-gray-200' : ''
                                    } hover:bg-gray-100`}
                                key={item.id}
                                role="menuitem"
                                tabIndex={-1}
                                title={item.label}
                                onClick={() => {
                                    setSelectedItem(item);
                                    setIsExpanded(false);
                                    if (onSelect) {
                                        onSelect(item);
                                    }
                                }}>
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

}