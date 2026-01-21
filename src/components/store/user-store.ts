import { create } from "zustand";

interface UserState {
	isInviteUserOpen: boolean;
	setInviteUserOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
	isInviteUserOpen: false,
	setInviteUserOpen: (open) => set({ isInviteUserOpen: open }),
}));
