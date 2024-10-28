import { useState, useEffect } from 'react';
import { useStorage, UserStorage } from '../storage';
import { User } from '../types/user';
import Login from './login';
import Chat from './chat';

export default function SidePanel() {
    // 讀取使用者資料，然後申請 state 來判斷是否已登入
    const user = useStorage(UserStorage);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(user.access_token ? true : false);

    // 使用 useEffect 來監聽使用者是否已登入，如果已登入則顯示聊天室，否則顯示登入頁面
    useEffect(() => {
        // 檢查使用者是否已登入
        chrome.storage.local.onChanged.addListener(changes => {
            const user = changes['user-storage-key'].newValue as User;
            setIsLoggedIn(!!user.access_token);
        });
    }, []);

    return <div className="h-full w-full">{isLoggedIn ? <Chat /> : <Login />}</div>;
}
