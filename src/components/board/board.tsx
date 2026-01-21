"use client";

import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BoardColumn } from "./components/board-column";
import { type Task, TaskCard } from "./components/task-card";
import { useBoardLogic } from "./hooks/use-board-logic";
import { TaskDialog } from "./task-dialog";

interface BoardColumnType {
	id: string;
	name: string;
	tasks: Task[];
	order: number;
}

interface BoardProps {
	boardId: string;
	initialColumns: BoardColumnType[];
}

export function Board({ boardId, initialColumns }: BoardProps) {
	const {
		columns,
		activeDragTask,
		sensors,
		taskDialogOpen,
		setTaskDialogOpen,
		selectedTask,
		selectedColumnId,
		createColumnOpen,
		setCreateColumnOpen,
		newColumnName,
		setNewColumnName,
		searchQuery,
		setSearchQuery,
		handleAddTask,
		handleEditTask,
		handleDeleteTask,
		handleDeleteColumn,
		handleCreateColumn,
		onDragStart,
		onDragOver,
		onDragEnd,
		isCreatingColumn,
	} = useBoardLogic(boardId, initialColumns);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
		>
			<div className="flex flex-col h-full space-y-4">
				<div className="w-full max-w-sm px-1">
					<Input
						placeholder="Search tasks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="bg-background"
					/>
				</div>

				<div className="flex h-full overflow-x-auto pb-4 gap-6 items-start">
					{columns.map((col) => (
						<BoardColumn
							key={col.id}
							id={col.id}
							name={col.name}
							tasks={col.tasks}
							onAddTask={handleAddTask}
							onEditTask={handleEditTask}
							onDeleteTask={handleDeleteTask}
							onDeleteColumn={handleDeleteColumn}
						/>
					))}

					<div className="w-80 shrink-0">
						<Button
							variant="outline"
							className="w-full h-12 border-dashed border-2 bg-transparent hover:bg-muted/50"
							onClick={() => setCreateColumnOpen(true)}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Column
						</Button>
					</div>
				</div>
			</div>

			<DragOverlay>
				{activeDragTask ? (
					<div className="rotate-2 opacity-80 cursor-grabbing">
						<TaskCard
							task={activeDragTask}
							onEdit={() => {}}
							onDelete={() => {}}
						/>
					</div>
				) : null}
			</DragOverlay>

			<TaskDialog
				open={taskDialogOpen}
				onOpenChange={setTaskDialogOpen}
				boardId={boardId}
				columns={columns.map((c) => ({ id: c.id, name: c.name }))}
				defaultColumnId={selectedColumnId}
				task={selectedTask as any}
			/>

			<Dialog open={createColumnOpen} onOpenChange={setCreateColumnOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Column</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Column Name</Label>
							<Input
								placeholder="e.g. Backlog"
								value={newColumnName}
								onChange={(e) => setNewColumnName(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setCreateColumnOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleCreateColumn} disabled={isCreatingColumn}>
							{isCreatingColumn ? "Creating..." : "Create Column"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</DndContext>
	);
}
