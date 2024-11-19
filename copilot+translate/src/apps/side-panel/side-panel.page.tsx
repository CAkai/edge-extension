import { useStorage } from "../../packages/storage";
import Auth from "./auth/auth.page";
import Chat from "./chat/chat.page";
import { userStorage } from "../../libs/user";


export default function SidePanel() {
    const user = useStorage(userStorage);

    return (
        <div className="h-full w-full">{user.icloud.access_token !== '' ? <Chat /> : <Auth />}</div>
    )
}
