import { LogDebug, LogError } from "../../packages/log";
import { Model } from "./llm.type";

// getModels 會從 Open WebUI 取得沒有隱藏的模型。
export async function getModels(token: string) {
    let error = null;

    const res = await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/models", {
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
			LogError(`Cannot fetch models: ${err}`);
			error = err;
			return null;
		});

    
	if (error) {
		throw error;
	}

	const models: Model[] = res?.data ?? [];
    LogDebug("Models fetched", models);

	return models
		.filter((m) => {
			const notArena = m.id !== "arena-model";
			const visible = !m.info?.meta?.hidden;
			const notPipeline = !Object.hasOwnProperty.call(m, "pipeline");
			return notArena && visible && notPipeline;
		});
}

export async function getDefaultPrompts() {
	let error = null;

    const res = await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/v1/configs/export", {
        method: "GET",
    })
        .then(async (res) => {
            if (!res.ok) throw await res.json();
			return res.json();
        })
        .catch((err) => {
			LogError(`Cannot fetch prompts: ${err}`);
			error = err;
			return null;
		});

    
	if (error) {
		throw error;
	}
	const prompts = res?.ui?.prompt_suggestions ?? [];
	LogDebug("Default Prompts fetched", prompts);
	return prompts;
}