import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { userStorage } from '../../libs/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Auth from './auth/auth.page';
import ChatBox from './chat/chatbox.page';
import { navStorage } from '../../libs/navigation';
import { NAVIGATION_NAME } from '../../libs/navigation/navigation.constant';
import { isNoUser } from '../../libs/user/user.type';

const queryClient = new QueryClient();

export default function SidePanel() {
    // 綁定 SidePanel 到背景頁，讓 connect 事件能夠觸發
    chrome.runtime.connect({ name: NAVIGATION_NAME.Sidepanel });
    navStorage.set(NAVIGATION_NAME.Sidepanel);
    const [isLoginned, setIsLoginned] = useState(false);
    // 檢查是否登入
    useEffect(() => {
        // 自動登入功能。
        // 此功能放在背景服務的話，userStorage 只會在背景服務啟動時執行一次，導致點錯頁面就無法自動登入
        userStorage.load().then(user => {
            setIsLoginned(!isNoUser(user));
        });
    }, []);

    return <>{isLoginned ? <ChatBox /> : <Auth />}</>;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <SidePanel />
        </QueryClientProvider>
    </StrictMode>,
);
