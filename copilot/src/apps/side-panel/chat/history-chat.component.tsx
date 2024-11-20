import { useEffect, useState } from "react";
import Dropdown, { DropdownItem } from "../../../components/dropdown.widget";
import { userStorage } from "../../../libs/user";
import HistoryIcon from '../../../../public/svg/history.svg?react';
import { fetchChatList } from "../../../libs/chat/chat.api";

export default function HistoryChat() {
    const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(undefined);
    const [items, setItems] = useState<DropdownItem[]>([]);

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
                }
            });
        }
        getList().then((list) => {
            setItems(list);
            setSelectedItem(list[0]);
        });
    }, []);

    // 因為 selectedModel 是 mutable 的，所以要複製一份
    const nextSelectedModel = selectedItem ? { ...selectedItem } : undefined;
    return (
        <Dropdown items={items} direction="bl" width="15rem" height="200px" selected={nextSelectedModel} onSelect={(newItem) => setSelectedItem({ ...newItem })}>
            <HistoryIcon style={{ width: '20px', height: '20px' }} />
        </Dropdown>
    )
}