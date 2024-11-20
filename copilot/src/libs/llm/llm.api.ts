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

	let models: Model[] = res?.data ?? [];
    LogDebug("Models fetched", models);

	models = models
		.filter((m) => m.id !== "arena-model" && !m.info?.meta?.hidden)
		// Sort the models
		.sort((a, b) => {
			// Check if models have position property
            const pos_a = a.info?.meta?.position;
            const pos_b = b.info?.meta?.position;
			const aHasPosition = pos_a !== undefined;
			const bHasPosition = pos_b !== undefined;

			// If both a and b have the position property
			if (aHasPosition && bHasPosition) {
				return pos_a - pos_b;
			}

			// If only a has the position property, it should come first
			if (aHasPosition) return -1;

			// If only b has the position property, it should come first
			if (bHasPosition) return 1;

			// Compare case-insensitively by name for models without position property
			const lowerA = a.name.toLowerCase();
			const lowerB = b.name.toLowerCase();

			if (lowerA < lowerB) return -1;
			if (lowerA > lowerB) return 1;

			// If same case-insensitively, sort by original strings,
			// lowercase will come before uppercase due to ASCII values
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;

			return 0; // They are equal
		});

	return models;
}