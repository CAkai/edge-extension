import { getItemFromLocalStorage, setItemInLocalStorage } from "../../packages/localstorage";
import { LogDebug, LogInfo } from "../../packages/log";
import { BaseStorage, createStorage, StorageEnum } from "../../packages/storage";
// import { getModels } from "../llm/llm.api";
import { checkWebUIToken, fetchCloudUser, iCloudLoginForm, logInCloud, logInWebUI, signUpWebUI } from "./user.api";
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
    isLogIn: () => Promise<boolean>;
    load: () => Promise<User>;
    logInCloud: (form: iCloudLoginForm) => Promise<User>;
    logInWebUI: () => Promise<User>;
}

export const userStorage: UserStorage = {
    ...storage,
    clear: async () => {
        LogDebug("清除使用者資料...");
        // await removeItemInLocalStorage(import.meta.env.VITE_ICLOUD_STORAGE_KEY as string);
        await storage.set(newUser());
    },
    save: async (newUser) => {
        // 有 access_token 才儲存到 localStorage，否則存入空白 token 會導致 iCloud 自動退出
        if (newUser.icloud.access_token) await setItemInLocalStorage(import.meta.env.VITE_ICLOUD_STORAGE_KEY as string, newUser.icloud.access_token);
        await storage.set(newUser);
    },
    isLogIn: async () => {
        const user = await storage.get();
        if (!user.icloud.access_token) {
            LogDebug("使用者尚未登入 iCloud");
            return false;
        }

        if (user.webui.token && await checkWebUIToken(user.webui.token)) return true;
        return false;
    },
    load: async () => {
        const user = await storage.get();

        LogDebug("正在檢查使用者資料...");

        // 如果已經有 access_token 和 webui_token，驗證一下 webui_token 是否還有效
        if (await userStorage.isLogIn()) return user;
        // 清除舊的 Open WebUI token
        // 要清的原因是底下會把 user 寫進 storage，如果不清，就會把舊的 token 寫進去，然後 logInWebUI 會失敗
        LogInfo("清除舊的 Open WebUI Token");
        user.webui.token = "";

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
        console.log(data);
        // 如果還是沒有成功，就直接返回
        if (!data) return user;

        // 因為使用者可能是處於 Pending 狀態，所以要檢查能不能認證。
        const isValid = await checkWebUIToken(data.token);
        if (!isValid) {
            LogInfo("Open WebUI Token 無效，請向管理員確認，是否已經啟用 Open WebUI...");
            return user;
        }

        user.webui = data;
        await storage.set(user);
        return user;
    },
};
