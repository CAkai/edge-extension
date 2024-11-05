import Login from './login';
import Chat from './chat';
import { useSelector } from 'react-redux';
import userStore, { loadFromStorage, UserState } from '../store/user.store';
import { useEffect } from 'react';

export default function SidePanel() {
    // useSelector 會自動訂閱 Redux store 的變化，當 store 變化時，會重新渲染元件
    const user = useSelector((state: UserState) => state.user);
    useEffect(() => {
        userStore.dispatch(loadFromStorage());
    }, []);

    return <div className="h-full w-full">{user.access_token !== '' ? <Chat /> : <Login />}</div>;
}
