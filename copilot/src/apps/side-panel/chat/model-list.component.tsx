import { useEffect, useState } from "react";
import Dropdown, { DropdownItem, DropdownSelectEvent } from "../../../components/dropdown.widget";
import { getModels } from "../../../libs/llm/llm.api";
import { userStorage } from "../../../libs/user";
import LlmIcon from '../../../../public/svg/model.svg?react';
import { useMessageStore } from "../../../libs/chat/chat.store";
import { i18n } from "../../../libs/alias";

type ModelListProps = {
    model?: string;
    onSelect?: DropdownSelectEvent;
};

export default function ModelList({ model, onSelect }: ModelListProps) {
    const [selectedModel, setSelectedModel] = useState<DropdownItem | undefined>(undefined);
    const [models, setModels] = useState<DropdownItem[]>([]);
    const {isIdle, addMessage} = useMessageStore();

    // 原本是用 useQuery，但因為執行太頻繁，出現 minify react error #301，
    // 所以改用 useEffect 來取得資料
    useEffect(() => {
        const fetchModels = async () => {
            const user = await userStorage.get();
            const data = await getModels(user.webui.token);
            if (!data) return Promise.reject('No data');
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
            onSelect?.(models[0]);
        })
        .catch(() => {
            // 如果沒有資料，表示沒有成功登入 Open WebUI，必須要重新登入。
            userStorage.clear();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 讀取外部的 model，並選擇對應的 model
    useEffect(() => {
        const selected = models.find((e) => e.value === model);
        if (selected) setSelectedModel(selected);
        else if (model !== "") {
            // 如果沒有找到對應的 model，就選擇第一個
            setSelectedModel(models[0]);
            // 然後發送錯誤訊息
            addMessage({role: "system-error", content: i18n("modelNotFound_model", model)});
            // 通知外面選擇第一個 model
            onSelect?.(models[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model]);

    // 因為 selectedModel 是 mutable 的，所以要複製一份
    const nextSelectedModel = selectedModel ? { ...selectedModel } : undefined;
    return (
        <div className="flex gap-1 items-center">
            <Dropdown
                items={models}
                disabled={!isIdle()}
                direction="tr"
                selected={nextSelectedModel}
                onSelect={(newItem) => {
                    const nextItem = { ...newItem };
                    setSelectedModel(nextItem);
                    onSelect?.(nextItem);
                }}>
                <LlmIcon style={{ width: '20px', height: '20px' }} />
            </Dropdown>
            <p>{selectedModel?.label ?? ''}</p>
        </div>
    )
}