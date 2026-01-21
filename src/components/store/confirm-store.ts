import { create } from "zustand";

interface ConfirmOptions {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
}

interface ConfirmState {
	isOpen: boolean;
	options: ConfirmOptions;
	resolve: ((value: boolean) => void) | null;
	requestConfirm: (options: ConfirmOptions) => Promise<boolean>;
	close: () => void;
	handleConfirm: () => void;
	handleCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
	isOpen: false,
	options: { title: "", description: "" },
	resolve: null,
	requestConfirm: (options) => {
		return new Promise((resolve) => {
			set({ isOpen: true, options, resolve });
		});
	},
	close: () => {
		set({ isOpen: false, resolve: null });
	},
	handleConfirm: () => {
		const { resolve, close } = get();
		if (resolve) resolve(true);
		close();
	},
	handleCancel: () => {
		const { resolve, close } = get();
		if (resolve) resolve(false);
		close();
	},
}));
