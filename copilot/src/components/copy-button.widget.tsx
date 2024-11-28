import { useState } from "react";
import { LogError } from '../packages/log';
import CopyIcon from "../../public/svg/copy.svg?react";
import CheckIcon from "../../public/svg/check.svg?react";


export default function CopyButton({ id }: { id: string }) {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        try {
            setCopied(true);
            const text = document.getElementById(id)!.innerText;
            await navigator.clipboard.writeText(text);
            setTimeout(() => setCopied(false), 1000);
        } catch (error) {
            LogError("Failed to copy text to clipboard", error);
        }
    }
    return <button
        className="relative inline-flex rounded-md p-2 items-center hover:bg-zinc-200 dark:hover:bg-zinc-800"
        onClick={onCopy}>
        <CopyIcon
            style={{ width: '20px', height: '20px' }}
            className={`transition-all ${copied ? 'scale-0' : 'scale-100'}`
            } />
        <CheckIcon
            style={{ width: '20px', height: '20px' }}
            className={`absolute transition-all ${copied ? 'scale-100' : 'scale-0'}`
            } />
    </button>
}