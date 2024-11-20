import { LogError } from "../../packages/log";
import { ChatBase, ChatCompletionRequest, ChatData } from "./chat.type";

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

export async function fetchChat(token: string, chatId: string) {
    let error = null;

    const res = await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + `api/v1/chats/${chatId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(async (res) => {
            if (!res.ok) throw await res.json();
            return res.json() as Promise<ChatData>;
        })
        .catch((err) => {
            LogError(`Cannot fetch chat: ${err}`);
            error = err;
            return null;
        });

    if (error) {
        throw error;
    }

    return res;
}

export async function generateChatCompletion(token: string, body: ChatCompletionRequest) {
	let error = null;

    const res = await fetch(`${import.meta.env.VITE_OPEN_WEBUI_URL}api/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).catch((err) => {
		error = err;
		return null;
	});

	if (error) {
		throw error;
	}

    if (res?.ok && res?.body) {
	    return res.body.pipeThrough(new TextDecoderStream()).getReader();
    }
};