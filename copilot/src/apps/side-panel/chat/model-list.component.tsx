import { useEffect, useState } from "react";
import Dropdown, { DropdownItem } from "../../../components/dropdown.widget";
import { getModels } from "../../../libs/llm/llm.api";
import { userStorage } from "../../../libs/user";
import LlmIcon from '../../../../public/svg/model.svg?react';

export default function ModelList() {
    const [selectedModel, setSelectedModel] = useState<DropdownItem | undefined>(undefined);
    const [models, setModels] = useState<DropdownItem[]>([]);
    
    // 原本是用 useQuery，但因為執行太頻繁，出現 minify react error #301，
    // 所以改用 useEffect 來取得資料
    useEffect(() => {
        const fetchModels = async () => {
            const user = await userStorage.get();
            const data = await getModels(user.webui.token);
            return data.map((e) => {
                return {
                    id: crypto.randomUUID(),
                    label: e.name,
                    value: e.id,
                }
            });
        }
        fetchModels().then((models) => {
            setModels(models);
            setSelectedModel(models[0]);
        });
    }, []);

    // 因為 selectedModel 是 mutable 的，所以要複製一份
    const nextSelectedModel = selectedModel ? { ...selectedModel } : undefined;
    return (
        <div className="flex gap-1 items-center">
            <Dropdown items={models} direction="br" selected={nextSelectedModel} onSelect={(newItem) => setSelectedModel({ ...newItem })}>
                <LlmIcon style={{ width: '20px', height: '20px' }} />
            </Dropdown>
            <p>{selectedModel?.label ?? ''}</p>
        </div>
    )
}