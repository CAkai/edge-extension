import { BaseStorage, createStorage, StorageEnum } from "../../packages/storage";
import { NAVIGATION_NAME } from "./navigation.constant";

const storage = createStorage<string>('navigation-storage-key', '', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});

type NavStorage = BaseStorage<string> & {
    clear: () => Promise<void>;
};

export const navStorage: NavStorage = {
    ...storage,
    clear: async () => {
        await storage.set(NAVIGATION_NAME.Root);
    },
};
