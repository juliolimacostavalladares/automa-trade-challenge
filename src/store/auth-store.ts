import { create } from "zustand";

interface AuthState {
	isLoading: boolean;
	error: string | null;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isLoading: false,
	error: null,
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	reset: () => set({ isLoading: false, error: null }),
}));
