import { createStorage, StorageEnum } from "../../packages/storage";

export type ThemeType = "light" | "dark";

export const themeStorage = createStorage<ThemeType>('theme-storage-key', 'light', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});

export type ThemeProps = {
    bgColor: string;
    textColor: string;
    bgColorUser: string;
    bgColorUserFile: string;
    bgColorBot: string;
    bgColorBotFile: string;
    // ReactMarkdown 的樣式
    mdProseStyle: string;
    mdCodeHeaderBgColor: string;
    mdCodeTextColor: string;
    mdBgColor: string;
}

const THEME_MAP: Record<ThemeType, ThemeProps> = {
    light: {
        bgColor: 'bg-slate-50',
        textColor: 'text-gray-900',
        bgColorUser: 'bg-gray-200',
        bgColorUserFile: 'bg-gray-300',
        bgColorBot: 'bg-slate-50',
        bgColorBotFile: 'bg-slate-100',
        mdProseStyle: "prose-zinc",
        mdCodeHeaderBgColor: "bg-zinc-100",
        mdCodeTextColor: "text-zinc-600",
        mdBgColor: "bg-gray-100",
    },
    dark: {
        bgColor: 'bg-gray-800',
        textColor: 'text-gray-100',
        bgColorUser: 'bg-gray-700',
        bgColorUserFile: 'bg-gray-600',
        bgColorBot: 'bg-gray-800',
        bgColorBotFile: 'bg-gray-700',
        mdProseStyle: "prose-invert",
        mdCodeHeaderBgColor: "bg-zinc-900",
        mdCodeTextColor: "text-zinc-400",
        mdBgColor: "bg-zinc-900",
    },
};



export function getThemeProps(theme: ThemeType): ThemeProps {
    return THEME_MAP[theme];
}
