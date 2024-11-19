export type iCloudUser = {
    // access_token 是儲存 iCloud 的 Token，用來認證所有與 iCloud 有關的 API。
    // 如果有人已經登入過 iCloud，則會在 localStorage 中儲存 access_token，那我們就可以從 localStorage 中取得 access_token。
    // 讓使用者不用再次登入。
    access_token: string;
    // 工號
    id: string;
    // 中文名
    name: string;
    // 部門
    department: string;
    // 廠區
    fab: string;
    // 電子郵件，都是 @umc.com
    email: string;
    // 權限角色，目前只有 admin 跟 user 兩種
    role: string;
};

export type OpenWebUIInfo = {
    id: string;
    email: string;
    name: string;
    role: string;
    profile_image_url: string;
    token: string;
    token_type: string;
    expires_at: number;
}

export type User = {
    // icloud_token 是儲存 iCloud 的 Token，用來認證所有與 iCloud 有關的 API。
    icloud: iCloudUser;
    // webui_token 是儲存 Open WebUI 的 Token，用來認證所有與 Open WebUI 有關的 API。
    webui: OpenWebUIInfo;
}

export function newUser(): User {
    return {
        icloud: {
            access_token: '',
            id: '',
            name: '',
            department: '',
            fab: '',
            email: '',
            role: ''
        },
        webui: {
            id: '',
            email: '',
            name: '',
            role: '',
            profile_image_url: '',
            token: '',
            token_type: '',
            expires_at: 0
        }
    }
}

export function isNoUser(user: User): boolean {
    return user.icloud.access_token === '' || user.webui.token === '';
}

