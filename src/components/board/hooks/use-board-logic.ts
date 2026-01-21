"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/hooks/use-confirm";
import { useBoardStore } from "@/components/store/board-store";
import { trpc } from "@/trpc/client";
import type { Task } from "../components/task-card";
import { type BoardColumn, useBoardDnD } from "./use-board-dnd";

export function useBoardLogic() {
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

	const [columns, setColumns] = useState<BoardColumn[]>([]);
	const [newColumnName, setNewColumnName] = useState("");

	const utils = trpc.useUtils();
	const { data: boardData } = trpc.getMainBoard.useQuery();
	const boardId = boardData?.id || "";

	const deleteTaskMutation = trpc.deleteTask.useMutation({
		onSuccess: () => {
			toast.success("Task deleted");
			utils.getMainBoard.invalidate();
		},
		onError: (err) => toast.error(err.message),
	});

	const moveTaskMutation = trpc.moveTask.useMutation({
		onError: () => {
			toast.error("Failed to move task");
			utils.getMainBoard.invalidate();
		},
	});

	const createColumnMutation = trpc.createColumn.useMutation({
		onSuccess: () => {
			toast.success("Column created");
			setCreateColumnOpen(false);
			setNewColumnName("");
			utils.getMainBoard.invalidate();
		},
	});

	const deleteColumnMutation = trpc.deleteColumn.useMutation({
		onSuccess: () => {
			toast.success("Column deleted");
			utils.getMainBoard.invalidate();
		},
	});

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

	useEffect(() => {
		if (boardData?.columns) {
			setColumns(boardData.columns as unknown as BoardColumn[]);
		}
	}, [boardData]);

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

	const handleAddTask = (columnId?: string) => {
		openTaskDialog({ columnId });
	};

	const handleEditTask = (task: Task) => {
		openTaskDialog({ task });
	};

	const confirm = useConfirm();

	const handleDeleteTask = async (id: string) => {
		if (
			await confirm({
				title: "Delete task?",
				description: "This action cannot be undone.",
				variant: "destructive",
			})
		) {
			deleteTaskMutation.mutate({ id });
		}
	};

	const handleDeleteColumn = async (id: string) => {
		if (
			await confirm({
				title: "Delete column?",
				description:
					"This will delete the column and all its tasks. This action cannot be undone.",
				variant: "destructive",
			})
		) {
			deleteColumnMutation.mutate({ id });
		}
	};

	const handleCreateColumn = () => {
		if (!newColumnName.trim() || !boardId) return;
		createColumnMutation.mutate({ boardId, name: newColumnName });
	};

	return {
		boardId,
		columns: filteredColumns,
		activeDragTask,
		sensors,
		isCreatingColumn: createColumnMutation.isPending,

		searchQuery,
		setSearchQuery,

		taskDialogOpen: isTaskDialogOpen,
		selectedTask,
		selectedColumnId,
		setTaskDialogOpen: (open: boolean) => (open ? null : closeTaskDialog()),

		createColumnOpen: isCreateColumnOpen,
		setCreateColumnOpen,
		newColumnName,
		setNewColumnName,

		handleAddTask,
		handleEditTask,
		handleDeleteTask,
		handleDeleteColumn,
		handleCreateColumn,

		onDragStart,
		onDragOver,
		onDragEnd,
	};
}
