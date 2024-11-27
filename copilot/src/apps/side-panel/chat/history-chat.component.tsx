import { useEffect, useState } from "react";
import Dropdown, { DropdownItem, DropdownSelectEvent } from "../../../components/dropdown.widget";
import { userStorage } from "../../../libs/user";
import HistoryIcon from '../../../../public/svg/history.svg?react';
import { fetchChatList } from "../../../libs/chat/chat.api";
import { useMessageStore } from "../../../libs/chat/chat.store";

export default function HistoryChat({ onSelect }: { onSelect: DropdownSelectEvent }) {
    const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(undefined);
    const [items, setItems] = useState<DropdownItem[]>([]);
    const isIdle = useMessageStore(state => state.isIdle);

    // 原本是用 useQuery，但因為執行太頻繁，出現 minify react error #301，
    // 所以改用 useEffect 來取得資料
    useEffect(() => {
        const getList = async () => {
            const user = await userStorage.get();
            const data = await fetchChatList(user.webui.token);
            return data.map((e) => {
                return {
                    id: crypto.randomUUID(),
                    label: e.title,
                    value: e.id,
                } as DropdownItem;
            });
        }
        getList().then((list) => {
            setItems(list);
            setSelectedItem(list[0]);
        });
    }, []);

    const handleSelect = (newItem: DropdownItem) => {
        const nextItem = { ...newItem };
        setSelectedItem(nextItem);
        onSelect(nextItem);
    }

    return (
        <Dropdown
            items={items}
            disabled={!isIdle()}
            direction="tl"
            width="15rem"
            height="20rem"
            // 因為 selectedModel 是 mutable 的，所以要複製一份
            selected={selectedItem ? { ...selectedItem } : undefined}
            onSelect={handleSelect}>
            <HistoryIcon style={{ width: '20px', height: '20px' }} />
        </Dropdown>
    )
}