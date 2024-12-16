import { create } from "zustand";
import { Model, PromptSuggestion } from "./llm.type";

interface LlmState {
    models: Model[];
    prompts: Record<string, PromptSuggestion[]>;
    set: (by: Model[]) => void;
    setDefaultPrompts: (by: PromptSuggestion[]) => void;
    getPrompts: (id: string) => PromptSuggestion[] | undefined;
    select: (id: string) => Model | undefined;
}

export const useLlmStore = create<LlmState>((set, get) => ({
    models: [],
    prompts: {},
    set: (by) => set({
        models:[...by],
        prompts: by.reduce((acc, cur) => {
            if (!cur?.info?.meta.suggestion_prompts) return acc;
            acc[cur.id] = cur.info.meta.suggestion_prompts.map(e => ({title: [e.content], content: e.content}));
            return acc;
        }, get().prompts),
    }),
    setDefaultPrompts: (by) => {
        const prompts = get().prompts;
        prompts['default'] = by;
        set({prompts});
    },
    getPrompts: (id) => get().prompts[id] ?? get().prompts['default'] ?? [],
    select: (id) => get().models.find(e => e.id === id),
}));