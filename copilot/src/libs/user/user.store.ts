import { getItemFromLocalStorage, removeItemInLocalStorage, setItemInLocalStorage } from "../../packages/localstorage";
import { LogInfo } from "../../packages/log";
import { BaseStorage, createStorage, StorageEnum } from "../../packages/storage";
import { fetchCloudUser, iCloudLoginForm, logInCloud, logInWebUI, signUpWebUI } from "./user.api";
import { newUser, User } from "./user.type";

const storage = createStorage<User>(
    "user-storage-key",
    newUser(),
    {
        storageEnum: StorageEnum.Local,
        liveUpdate: true,
    }
);

type UserStorage = BaseStorage<User> & {
    clear: () => Promise<void>;
    save: (user: User) => Promise<void>;
    load: () => Promise<User>;
    logInCloud: (form: iCloudLoginForm) => Promise<User>;
    logInWebUI: () => Promise<User>;
}

export const userStorage: UserStorage = {
    ...storage,
    clear: async () => {
        await removeItemInLocalStorage(import.meta.env.VITE_ICLOUD_STORAGE_KEY as string);
        await storage.set(newUser());
    },
    save: async (newUser) => {
        await setItemInLocalStorage(import.meta.env.VITE_ICLOUD_STORAGE_KEY as string, newUser.icloud.access_token);
        await storage.set(newUser);
    },
    load: async () => {
        const user = await storage.get();

        LogInfo("正在檢查使用者資料...");
        // 如果已經有 access_token 和 webui_token，表示已經登入過了，直接返回
        if (!user.icloud.access_token && !user.webui.token) return user;

        // 取得 icloud 資料
        // 這裡不需要去 chrome.storage 取得 icloud token 是因為 storage 就是以 chrome.storage 操作的
        if (!user.icloud.access_token) {
            const token: string = await getItemFromLocalStorage(import.meta.env.VITE_ICLOUD_STORAGE_KEY as string);
            if (!token) return user;  // 其實這邊也可以回傳 initialState

            // 驗證 token，並到 iCloud 取得使用者資料
            const userinfo = await fetchCloudUser(token);
            if (!userinfo) return user;
            user.icloud = userinfo;
        }

        // 儲存到 storage
        await userStorage.save(user);
        // 登入 webui
        return await userStorage.logInWebUI();
    },
    logInCloud: async (form: iCloudLoginForm) => {
        const user = await storage.get();
        const data = await logInCloud(form);
        if (!data) return user;
        user.icloud = data;
        // 儲存到 storage
        await userStorage.save(user);
        // 登入 webui
        return await userStorage.logInWebUI();
    },
    logInWebUI: async () => {
        const user = await storage.get();
        // 如果沒有 icloud token，就無法登入 webui，因此直接返回
        // 如果已經登入過 webui，就不用再登入
        if (!user.icloud.access_token || user.webui.token) return user;
        // 先登入看看，如果沒有成功，就註冊
        const data = await logInWebUI({
            email: user.icloud.id + "@umc.com",
            password: user.icloud.access_token
        })
            ?? await signUpWebUI({
                name: user.icloud.name,
                email: user.icloud.id + "@umc.com",
                password: user.icloud.access_token
            });
        // 如果還是沒有成功，就直接返回
        if (!data) return user;

        user.webui = data;
        await storage.set(user);
        return user;
    },
};
