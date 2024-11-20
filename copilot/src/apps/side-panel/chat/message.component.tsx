import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Message } from "../../../libs/chat/chat.type";
import LoadingIcon from "../../../components/loading.widget";
import "highlight.js/styles/github.css";
import TermianlIcon from "../../../../public/svg/terminal.svg?react";
import CopyButton from "../../../components/copy-button.component";

function components() {
    return {
        pre: ({ children }: any) => <pre className="not-prose">{children}</pre>,
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (match?.length) {
                const id = Math.random().toString(36).substring(2,9);
                return (
                    <div className="not-prose rounded-md border">
                        <div className="flex h-12 items-ctner justify-between bg-zinc-100 dark:bg-zinc-900">
                            <div className="px-2 flex items-center gap-2">
                                <TermianlIcon style={{ width: '20px', height: '20px' }} />
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {match[1]}
                                </p>
                            </div>
                            <CopyButton id={id} />
                        </div>
                        <div className="overflow-x-auto">
                            <div id={id} className="p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <code className="not-prose rounded bg-gray-100 px-1 dark:bg-zinc-900" {...props}>
                        {children}
                    </code>
                )
            }
        },
    };
}


export type MessageItem = Message & {
    id: string;
}

type MessageBlockProps = {
    message: MessageItem;
}

export default function MessageBlock({ message }: MessageBlockProps) {
    return <div key={message.id} className={`p-1 flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
        {message.role === 'user' ? false : <p>{message.role}</p>}
        <div
            className={`p-2 rounded-lg w-fit max-w-[95%] text-base ${message.role === 'user' ? 'bg-gray-200' : 'bg-slate-50'
                }`}>
            {message.content === '' ? <LoadingIcon /> :
                <ReactMarkdown
                    className="prose prose-zinc max-w-none dark:prose-invert"
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={components()}>
                    {message.content}
                </ReactMarkdown>}
        </div>
    </div>
}