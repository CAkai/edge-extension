import { create } from "zustand";
import { Model } from "./llm.type";

interface LlmState {
    models: Model[];
    set: (by: Model[]) => void;
    select: (id: string) => Model | undefined;
}

export const useLlmStore = create<LlmState>((set, get) => ({
    models: [],
    set: (by) => set({models:[...by]}),
    select: (id) => get().models.find(e => e.id === id),
}));