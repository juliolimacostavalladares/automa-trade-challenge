import {
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { Task } from "../components/task-card";

export type BoardColumn = {
	id: string;
	name: string;
	tasks: Task[];
	order: number;
};

interface UseBoardDnDProps {
	columns: BoardColumn[];
	setColumns: Dispatch<SetStateAction<BoardColumn[]>>;
	onTaskMove: (taskId: string, newColumnId: string, newIndex: number) => void;
}

export function useBoardDnD({
	columns,
	setColumns,
	onTaskMove,
}: UseBoardDnDProps) {
	const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 150,
				tolerance: 5,
			},
		}),
	);

	const onDragStart = (event: DragStartEvent) => {
		if (event.active.data.current?.type === "Task") {
			setActiveDragTask(event.active.data.current.task);
		}
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveTask = active.data.current?.type === "Task";
		const isOverTask = over.data.current?.type === "Task";

		if (!isActiveTask) return;

		const activeColumnIndex = columns.findIndex((col) =>
			col.tasks.some((t) => t.id === activeId),
		);

		let overColumnIndex = -1;
		if (isOverTask) {
			overColumnIndex = columns.findIndex((col) =>
				col.tasks.some((t) => t.id === overId),
			);
		} else {
			overColumnIndex = columns.findIndex((col) => col.id === overId);
		}

		if (activeColumnIndex === -1 || overColumnIndex === -1) return;

		const activeColumn = columns[activeColumnIndex];
		const overColumn = columns[overColumnIndex];

		const activeTaskIndex = activeColumn.tasks.findIndex(
			(t) => t.id === activeId,
		);

		let overTaskIndex = 0;
		if (isOverTask) {
			overTaskIndex = overColumn.tasks.findIndex((t) => t.id === overId);
		} else {
			overTaskIndex = overColumn.tasks.length;
		}

		if (activeColumnIndex === overColumnIndex) {
			const newTasks = arrayMove(
				activeColumn.tasks,
				activeTaskIndex,
				overTaskIndex,
			);
			const newColumns = [...columns];
			newColumns[activeColumnIndex] = { ...activeColumn, tasks: newTasks };
			setColumns(newColumns);
		} else {
			const newActiveTasks = [...activeColumn.tasks];
			const [movedTask] = newActiveTasks.splice(activeTaskIndex, 1);

			const newOverTasks = [...overColumn.tasks];
			const safeOverIndex =
				overTaskIndex >= 0 ? overTaskIndex : newOverTasks.length;

			newOverTasks.splice(safeOverIndex, 0, {
				...movedTask,
				columnId: overColumn.id,
			});

			const newColumns = [...columns];
			newColumns[activeColumnIndex] = {
				...activeColumn,
				tasks: newActiveTasks,
			};
			newColumns[overColumnIndex] = { ...overColumn, tasks: newOverTasks };
			setColumns(newColumns);
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setActiveDragTask(null);
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id as string;
		const activeColumn = columns.find((col) =>
			col.tasks.some((t) => t.id === activeId),
		);
		if (!activeColumn) return;

		const taskIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);

		onTaskMove(activeId, activeColumn.id, taskIndex);
	};

	return {
		sensors,
		activeDragTask,
		onDragStart,
		onDragOver,
		onDragEnd,
	};
}
