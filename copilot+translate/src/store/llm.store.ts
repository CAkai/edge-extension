import { createSlice, configureStore } from "@reduxjs/toolkit";

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

const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {
    }
})

// 定義 Redux store，使用者可以透過 store.dispatch 來發送 action
const llmStore = configureStore({
    reducer: {
        theme: llmSlice.reducer,
    }
})

export default llmStore