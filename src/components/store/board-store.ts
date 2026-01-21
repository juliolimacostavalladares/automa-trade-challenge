import { create } from "zustand";
import type { Task } from "@/components/board/components/task-card";

interface BoardState {
	searchQuery: string;
	setSearchQuery: (query: string) => void;

	isTaskDialogOpen: boolean;
	selectedTask: Task | undefined;
	selectedColumnId: string | undefined;
	openTaskDialog: (opts?: { task?: Task; columnId?: string }) => void;
	closeTaskDialog: () => void;

	isCreateColumnOpen: boolean;
	setCreateColumnOpen: (open: boolean) => void;

	isCreateBoardOpen: boolean;
	setCreateBoardOpen: (open: boolean) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
	searchQuery: "",
	setSearchQuery: (query) => set({ searchQuery: query }),

	isTaskDialogOpen: false,
	selectedTask: undefined,
	selectedColumnId: undefined,
	openTaskDialog: (opts) =>
		set({
			isTaskDialogOpen: true,
			selectedTask: opts?.task,
			selectedColumnId: opts?.columnId,
		}),
	closeTaskDialog: () =>
		set({
			isTaskDialogOpen: false,
			selectedTask: undefined,
			selectedColumnId: undefined,
		}),

	isCreateColumnOpen: false,
	setCreateColumnOpen: (open) => set({ isCreateColumnOpen: open }),

	isCreateBoardOpen: false,
	setCreateBoardOpen: (open) => set({ isCreateBoardOpen: open }),
}));
