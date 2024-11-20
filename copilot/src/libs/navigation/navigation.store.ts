import { createStorage, StorageEnum } from "../../packages/storage";


export const navStorage = createStorage<string>('navigation-storage-key', '', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});
