"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task, TaskCard } from "./task-card";

interface SortableTaskProps {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => void;
}

export function SortableTask({ task, onEdit, onDelete }: SortableTaskProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: "Task",
			task,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
		</div>
	);
}
