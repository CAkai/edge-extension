import { LogError, LogInfo, LogWarning } from "../../packages/log";
import { i18n } from "../alias";
import { iCloudUser, OpenWebUIInfo } from "./user.type";
import { z } from 'zod';

/*
 * iCloud API
 */

// fetchUserInfo 會到 iCloud 伺服器，依照傳入的 token 取得使用者資料。
export async function fetchCloudUser(token: string): Promise<iCloudUser | null> {
    LogInfo("正在取得 iCloud 使用者資料...");
    return await fetch(import.meta.env.VITE_ICLOUD_URL + "api/v1/auth", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.error) {
                console.error(`連線到 iCloud 時，發生了錯誤：${res.error}`);
                return null;
            }

            console.log("已搜尋到 iCloud Token");
            return {
                ...res,
                access_token: token,
            };
        })
        .catch((err) => {
            console.error("error", err);
            return null;
        });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const iCloudLoginFormSchema = z.object({
    username: z.string().regex(new RegExp(/^(000\d{5}|[zZ]\d{4})$/), { message: i18n('inputError_name', i18n("empid")) }),
    password: z.string(),
});

export type iCloudLoginForm = z.infer<typeof iCloudLoginFormSchema>;

// iCloud 登入函數，傳入使用者的帳號密碼，並回傳使用者資料。
export async function logInCloud(data: iCloudLoginForm): Promise<iCloudUser | null> {
    return await fetch(`${import.meta.env.VITE_ICLOUD_URL}api/v1/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .catch(console.error);
};


/*
 * Open WebUI API
 */

// logInWebUI 函數會在使用者登入 iCloud 後，自動登入 Open WebUI。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WebUILoginFormSchema = z.object({
    email: z.string().regex(new RegExp(/^(000\d{5}|[zZ]\d{4})@umc\.com$/), { message: i18n('inputError_name', "email") }),
    password: z.string(),
});

type WebUILoginForm = z.infer<typeof WebUILoginFormSchema>;

export async function logInWebUI(form: WebUILoginForm): Promise<OpenWebUIInfo | null> {
    LogInfo("正在登入 Open WebUI...");
    return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/auths/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: form.email,
            password: form.password,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.detail) {
                LogWarning(`連線到 Open WebUI 時，發生了錯誤：${data.detail}`);
                return null;
            }
            return data as OpenWebUIInfo;
        })
        .catch((err) => {
            LogError(err);
            return null;
        });
}

// signUpWebUI 函數會在使用者第一次登入時，自動註冊 Open WebUI。
// 有可能還沒登入過 Open WebUI，所以要先註冊。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WebUISignupFormSchema = z.object({
    name: z.string(),
    email: z.string().regex(new RegExp(/^(000\d{5}|[zZ]\d{4})@umc\.com$/), { message: i18n('inputError_name', "email") }),
    password: z.string(),
});

type WebUISignupForm = z.infer<typeof WebUISignupFormSchema>;

export async function signUpWebUI(form: WebUISignupForm): Promise<OpenWebUIInfo | null> {
    LogInfo("正在註冊 Open WebUI...");
    return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/auths/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            profile_image_url: ""
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.detail) {
                LogWarning(`無法註冊 Open WebUI，發生了錯誤：${data.detail}`);
                return null;
            }
            return data as OpenWebUIInfo;
        })
        .catch((err) => {
            LogError(err);
            return null
        });
}