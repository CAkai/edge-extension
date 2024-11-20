import { createStorage, StorageEnum } from "../../packages/storage";

export type ThemeType = "light" | "dark";

export const themeStorage = createStorage<ThemeType>('theme-storage-key', 'light', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});

type ThemeProps = {
    bgColor: string;
    textColor: string;
}

const THEME_MAP: Record<ThemeType, ThemeProps> = {
    light: {
        bgColor: 'bg-slate-50',
        textColor: 'text-gray-900',
    },
    dark: {
        bgColor: 'bg-gray-800',
        textColor: 'text-gray-100',
    },
};



export function getThemeProps(theme: ThemeType): ThemeProps {
    return THEME_MAP[theme];
}
