import { useEffect, useState } from "react";
import Dropdown, { DropdownItem, DropdownSelectEvent } from "../../../components/dropdown.widget";
import { useMessageStore } from "../../../libs/chat/chat.store";
import { useLlmStore } from "../../../libs/llm";
import LightIcon from '../../../../public/svg/light.svg?react';

type ModelPromptButtonProps = {
    model: string;
    onSelect?: DropdownSelectEvent;
};


export default function ModelPromptButton({ model, onSelect }: ModelPromptButtonProps) {
    const allPrompts = useLlmStore(state => state.prompts);
    const [prompts, setPrompts] = useState<DropdownItem[]>([]);
    const isIdle = useMessageStore(state => state.isIdle);

    // 如果 model 改變或者系統第一次從 Open WebUI 把 Prompts 下載回來，都會觸發這個 useEffect
    useEffect(() => {
        // 如果該 model 沒有 prompts，就使用 default 的 prompts
        const modelPrompts = allPrompts[model] ?? allPrompts['default'];
        if (!modelPrompts) return;
        const items = modelPrompts.map((e) => {
            return {
                id: crypto.randomUUID(),
                label: e.title?.[0] ?? e.content,
                value: e.content,
            }
        });
        setPrompts(items);
    }, [model, allPrompts]);

    return (
        <Dropdown
            items={prompts}
            disabled={!isIdle()}
            direction="tr"
            height="20rem"
            width="18rem"
            onSelect={(newItem) => {
                onSelect?.(newItem);
            }}>
            <LightIcon style={{ width: '20px', height: '20px' }} />
        </Dropdown>
    )
}