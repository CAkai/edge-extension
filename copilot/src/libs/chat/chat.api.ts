import { LogError } from "../../packages/log";
import { ChatBase } from "./chat.type";

export async function fetchChatList(token: string) {
    let error = null;

    const res: ChatBase[] = await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/chats/list", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(async (res) => {
            if (!res.ok) throw await res.json();
			return res.json();
        })
        .catch((err) => {
			LogError(`Cannot fetch chat list: ${err}`);
			error = err;
			return null;
		});

    
	if (error) {
		throw error;
	}

    return res ?? [];
}