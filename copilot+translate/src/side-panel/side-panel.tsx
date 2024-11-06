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
    useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    return <div className="h-full w-full">{user.access_token !== '' ? <Chat /> : <Login />}</div>;
}
