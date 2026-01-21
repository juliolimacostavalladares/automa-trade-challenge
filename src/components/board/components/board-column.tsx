"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableTask } from "./sortable-task";
import type { Task } from "./task-card";

interface BoardColumnProps {
	id: string;
	name: string;
	tasks: Task[];
	onAddTask: (columnId: string) => void;
	onEditTask: (task: Task) => void;
	onDeleteTask: (id: string) => void;
	onDeleteColumn: (id: string) => void;
}

export function BoardColumn({
	id,
	name,
	tasks,
	onAddTask,
	onEditTask,
	onDeleteTask,
	onDeleteColumn,
}: BoardColumnProps) {
	const { setNodeRef } = useDroppable({
		id: id,
		data: {
			type: "Column",
			column: { id, name, tasks },
		},
	});

	return (
		<div
			ref={setNodeRef}
			className="w-80 shrink-0 flex flex-col h-full max-h-full rounded-xl bg-muted/20 p-2"
		>
			<div className="flex items-center justify-between mb-3 px-2 pt-2">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-base text-foreground">{name}</h3>
					<span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
						{tasks.length}
					</span>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-6 w-6">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							className="text-destructive"
							onClick={() => onDeleteColumn(id)}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete Column
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex-1 overflow-y-auto px-1 pb-2 custom-scrollbar min-h-25">
				<SortableContext
					items={tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
				>
					{tasks.map((task) => (
						<SortableTask
							key={task.id}
							task={task}
							onEdit={onEditTask}
							onDelete={onDeleteTask}
						/>
					))}
				</SortableContext>
				<Button
					variant="ghost"
					className="w-full justify-start text-muted-foreground hover:text-primary gap-2 mt-2 h-auto py-2"
					onClick={() => onAddTask(id)}
				>
					<Plus className="h-4 w-4" />
					Add Task
				</Button>
			</div>
		</div>
	);
}
