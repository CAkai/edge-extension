import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export type LLM = {
    id: string;
    object: string;
    name: string;
    owned_by: string;
    created: number;
    urlIndex: number;
    // action: any[];  // 這個欄位不確定是什麼型別，所以先註解掉
    ollama?: OllamaModel;
    openai?: OpenAIModel;
};

type OllamaModel = {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
        parent_model: string;
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
    urls: number[];
};

type OpenAIModel = {
    id: string;
    object: string;
    created: number;
    owned_by: string;
};

const initialState: LLM[] = [];

export const loadLlmModels = createAsyncThunk(
    'llm/loadModels',
    async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY0ZmEwYjRkLTk2MzItNDYxMC05NzQ1LTZjOGVlODAwNzE5MSJ9.chVpe8emNjW8cW5I15i2EOA7zHhs2XlZfn2DPPFlDhk";
        console.log(1);
        // 到 iCloud 取得使用者資料
        return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(2);
                const data: LLM[] = res.data as LLM[];
                return data.filter((llm) => llm.id !== "arena-model");
            })
            .catch((err) => {
                console.error("error", err);
            });
    }
);

export const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadLlmModels.fulfilled, (_, {payload}) => {
            console.log(payload);
            if (!payload) return [];
            return Array.from(payload);
        });
    }
})
