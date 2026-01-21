import { create } from "zustand";

interface UIState {
	globalSearchQuery: string;
	setGlobalSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
	globalSearchQuery: "",
	setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
}));
