/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { MessageInfo } from '../../../libs/chat/chat.type';
import LoadingIcon from '../../../components/loading.widget';
import 'highlight.js/styles/github.css';
import TermianlIcon from '../../../../public/svg/terminal.svg?react';
import CopyButton from '../../../components/copy-button.component';
import { useStorage } from '../../../packages/storage';
import { getThemeProps, themeStorage } from '../../../libs/theme';
import FileButton from '../../../components/file-button.component';
import FileTagButton from '../../../components/file-tag-button.component';
import { ThemeProps } from '../../../libs/theme/theme.store';

function components(theme: ThemeProps) {
    return {
        pre: ({ children }: any) => (
            <pre className='not-prose whitespace-pre-line'>{children}</pre>
        ),
        code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (match?.length) {
                const id = Math.random().toString(36).substring(2, 9);
                return (
                    <div className="not-prose rounded-md border">
                        {/* 加 overflow 是因為有些內容會超出訊息框 */}
                        <div className={`flex h-12 items-ctner justify-between ${theme.mdCodeHeaderBgColor}`}>
                            <div className="px-2 flex items-center gap-2">
                                <TermianlIcon style={{ width: '20px', height: '20px' }} />
                                <p className={`text-sm ${theme.mdCodeTextColor}`}>{match[1]}</p>
                            </div>
                            <CopyButton id={id} />
                        </div>
                        <div className="overflow-x-auto">
                            <div id={id} className="p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <code className={`not-prose roundedpx-1 ${theme.mdBgColor}`} {...props}>
                        {children}
                    </code>
                );
            }
        },
    };
}

type MessageBlockProps = {
    message: MessageInfo;
};

export default function MessageBlock({ message }: MessageBlockProps) {
    const theme = getThemeProps(useStorage(themeStorage));

    const generateUserFile = () => {
        if (message.role !== 'user') return null;
        if (!message?.files?.length) return null;
        return message.files
            .filter(f => f.type === 'image' || f.type === 'file')
            .map(f => {
                if (f.type === 'image')
                    return (
                        <img
                            key={crypto.randomUUID()}
                            src={f.url}
                            alt="image"
                            className="rounded-lg mb-1 w-fit max-w-[95%]"
                        />
                    );
                else return <FileButton name={f.name} size={f.size} />;
            });
    };

    const generateBotFile = () => {
        if (message.role === 'user') return null;
        if (!message?.citations?.length) return null;

        return (
            <div className="flex text-xs font-medium items-center">
                {message.citations.map((c, i) => {
                    return <FileTagButton index={i + 1} name={c.source.name} />;
                })}
            </div>
        );
    };

    return (
        <div key={message.id} className={`p-1 flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
            {generateUserFile()}
            {message.role === 'user' ? false : <p>{message.role}</p>}
            <div
                className={`p-2 rounded-lg w-fit max-w-[95%] text-base ${
                    message.role === 'user' ? theme.bgColorUser : theme.bgColorBot
                }`}>
                {message.content === '' ? (
                    <LoadingIcon />
                ) : (
                    <ReactMarkdown
                        className={`prose ${theme.mdProseStyle} max-w-none`}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={components(theme)}>
                        {message.content}
                    </ReactMarkdown>
                )}
                {generateBotFile()}
            </div>
        </div>
    );
}
