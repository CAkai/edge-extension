import { User } from "../types/user";
import { StorageEnum } from "./enums";
import { createStorage } from "./main";
import { BaseStorage } from "./types";
export * from './main';

// 主題
type Theme = 'light' | 'dark';

type ThemeStorage = BaseStorage<Theme> & {
    toggle: () => Promise<void>;
};

const storage = createStorage<Theme>('theme-storage-key', 'light', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});

// You can extend it with your own methods
export const ThemeStorage: ThemeStorage = {
    ...storage,
    toggle: async () => {
        await storage.set(currentTheme => {
            return currentTheme === 'light' ? 'dark' : 'light';
        });
    },
};

// 使用者
export const UserStorage = createStorage<User>('user-storage-key', {
    id: "",
    name: "",
    email: "",
    access_token: "",
    role: "user",
    department: "",
    fab: "",
}, {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});