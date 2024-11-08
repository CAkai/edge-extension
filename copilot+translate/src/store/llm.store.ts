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

const initialState: {
    selected: string;
    models: LLM[];
} = {
    selected: "",
    models: [],
};

export const loadLlmModels = createAsyncThunk(
    'llm/loadModels',
    async (token: string) => {
        if (!token) return;

        // 到 iCloud 取得使用者資料
        return await fetch(import.meta.env.VITE_OPEN_WEBUI_URL + "api/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                let data: LLM[] = res.data as LLM[];
                data = data.filter((llm) => llm.id !== "arena-model");

                if (data.length > 0) {
                    return {
                        selected: data[0].id,
                        models: data,
                    }
                } else {
                    return initialState;
                }
            })
            .catch((err) => {
                console.error("error", err);
            });
    }
);

export const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {
        selectModel: (state, action) => {
            state.selected = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadLlmModels.fulfilled, (state, {payload}) => {
            if (!payload) return {...state};
            return {...payload};
        });
    }
})
