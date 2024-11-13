import Login from './login';
import Chat from './chat';
import { useSelector } from 'react-redux';
import { loadFromStorage } from '../store/user.store';
import { useEffect } from 'react';
import { RootState, useAppDispatch } from '../store';

export default function SidePanel() {
    const dispatch = useAppDispatch();
    // useSelector 會自動訂閱 Redux store 的變化，當 store 變化時，會重新渲染元件
    const user = useSelector((state: RootState) => state.user);
    // 標記目前在 Chat 組件，原因是 background 和 side-panel 讀不到 store，所以要透過 chrome.storage 來儲存
    void chrome.storage.local.set({ isInChat: user.access_token !== '' });

    useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    return <div className="h-full w-full">{user.access_token !== '' ? <Chat /> : <Login />}</div>;
}
