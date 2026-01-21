"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useBoardStore } from "@/components/store/board-store";
import { trpc } from "@/trpc/client";
import type { Task } from "../components/task-card";
import { type BoardColumn, useBoardDnD } from "./use-board-dnd";

export function useBoardLogic(boardId: string, initialColumns: BoardColumn[]) {
	// Global UI State
	const {
		searchQuery,
		setSearchQuery,
		isTaskDialogOpen,
		selectedTask,
		selectedColumnId,
		openTaskDialog,
		closeTaskDialog,
		isCreateColumnOpen,
		setCreateColumnOpen,
	} = useBoardStore();

	// Local State
	const [columns, setColumns] = useState<BoardColumn[]>(initialColumns);
	const [newColumnName, setNewColumnName] = useState("");

	const utils = trpc.useUtils();

	// Mutations
	const deleteTaskMutation = trpc.deleteTask.useMutation({
		onSuccess: () => {
			toast.success("Task deleted");
			utils.getBoard.invalidate({ id: boardId });
		},
		onError: (err) => toast.error(err.message),
	});

	const moveTaskMutation = trpc.moveTask.useMutation({
		onError: () => {
			toast.error("Failed to move task");
			utils.getBoard.invalidate({ id: boardId });
		},
	});

	const createColumnMutation = trpc.createColumn.useMutation({
		onSuccess: () => {
			toast.success("Column created");
			setCreateColumnOpen(false);
			setNewColumnName("");
			utils.getBoard.invalidate({ id: boardId });
		},
	});

	const deleteColumnMutation = trpc.deleteColumn.useMutation({
		onSuccess: () => {
			toast.success("Column deleted");
			utils.getBoard.invalidate({ id: boardId });
		},
	});

	// DnD Logic Delegation
	const { sensors, activeDragTask, onDragStart, onDragOver, onDragEnd } =
		useBoardDnD({
			columns,
			setColumns,
			onTaskMove: (taskId, newColumnId, newIndex) => {
				moveTaskMutation.mutate({
					taskId,
					newColumnId,
					newIndex,
				});
			},
		});

	// Effect: Sync Initial Data
	useEffect(() => {
		setColumns(initialColumns);
	}, [initialColumns]);

	// Computed: Filtering
	const filteredColumns = useMemo(() => {
		if (!searchQuery.trim()) return columns;
		const query = searchQuery.toLowerCase();
		return columns.map((col) => ({
			...col,
			tasks: col.tasks.filter(
				(t) =>
					t.title.toLowerCase().includes(query) ||
					t.description?.toLowerCase().includes(query) ||
					t.label?.toLowerCase().includes(query) ||
					t.assignee?.name.toLowerCase().includes(query),
			),
		}));
	}, [columns, searchQuery]);

	// Action Handlers
	const handleAddTask = (columnId?: string) => {
		openTaskDialog({ columnId });
	};

	const handleEditTask = (task: Task) => {
		openTaskDialog({ task });
	};

	const handleDeleteTask = (id: string) => {
		if (confirm("Delete task?")) {
			deleteTaskMutation.mutate({ id });
		}
	};

	const handleDeleteColumn = (id: string) => {
		if (confirm("Delete column and all its tasks?")) {
			deleteColumnMutation.mutate({ id });
		}
	};

	const handleCreateColumn = () => {
		if (!newColumnName.trim()) return;
		createColumnMutation.mutate({ boardId, name: newColumnName });
	};

	return {
		// Data
		columns: filteredColumns,
		activeDragTask,
		sensors,
		isCreatingColumn: createColumnMutation.isPending,

		// Search
		searchQuery,
		setSearchQuery,

		// Task Dialog
		taskDialogOpen: isTaskDialogOpen,
		selectedTask,
		selectedColumnId,
		setTaskDialogOpen: (open: boolean) => (open ? null : closeTaskDialog()),

		// Create Column Dialog
		createColumnOpen: isCreateColumnOpen,
		setCreateColumnOpen,
		newColumnName,
		setNewColumnName,

		// Actions
		handleAddTask,
		handleEditTask,
		handleDeleteTask,
		handleDeleteColumn,
		handleCreateColumn,

		// DnD Events
		onDragStart,
		onDragOver,
		onDragEnd,
	};
}
