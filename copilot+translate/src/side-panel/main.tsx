import Login from './login';
import Chat from './chat';
import { useSelector } from 'react-redux';
import { User } from '../store/user.store';

export default function SidePanel() {
    // useSelector 會自動訂閱 Redux store 的變化，當 store 變化時，會重新渲染元件
    const user = useSelector((state: { user: User }) => state.user);

    return <div className="h-full w-full">{user.access_token !== '' ? <Chat /> : <Login />}</div>;
}
