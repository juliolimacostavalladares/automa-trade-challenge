"use client";

import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BoardColumn } from "./components/board-column";
import { TaskCard } from "./components/task-card";
import { useBoardLogic } from "./hooks/use-board-logic";
import { TaskDialog } from "./task-dialog";

export function Board() {
	const {
		boardId,
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
	} = useBoardLogic();

	if (!boardId && columns.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">Loading...</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			autoScroll
		>
			<div className="flex flex-col h-full space-y-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-1 gap-4">
					<div className="w-full sm:max-w-sm">
						<Input
							startIcon={<Search className="h-4 w-4" />}
							placeholder="Search tasks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-card border-none rounded-2xl py-6 focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/40 text-sm transition-all shadow-sm"
						/>
					</div>
					<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
						<Button
							variant="outline"
							onClick={() => setCreateColumnOpen(true)}
							className="flex-1 sm:flex-none h-12 px-4 sm:px-6 rounded-2xl gap-2 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary transition-all active:scale-95 whitespace-nowrap font-bold"
						>
							<Plus className="h-5 w-5" />
							<span className="hidden xs:inline">Add Column</span>
							<span className="xs:hidden">Column</span>
						</Button>
						<Button
							onClick={() => handleAddTask()}
							className="flex-1 sm:flex-none bg-primary text-primary-foreground h-12 px-4 sm:px-6 rounded-2xl gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap font-bold"
						>
							<Plus className="h-5 w-5" />
							<span className="hidden xs:inline">Add New Task</span>
							<span className="xs:hidden">Task</span>
						</Button>
					</div>
				</div>

				<div
					className={cn(
						"flex-1 min-h-0 bg-muted/50 rounded-3xl p-4 sm:p-6 overflow-x-auto border border-border/50 shadow-inner snap-mandatory scroll-smooth",
						activeDragTask ? "snap-none" : "snap-x",
					)}
				>
					<div className="flex h-full gap-4 sm:gap-6 items-start">
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

						<div className="w-[85vw] xs:w-80 shrink-0 snap-center">
							<Button
								variant="outline"
								className="w-full h-12 border-dashed border-2 bg-background/40 hover:bg-background/80 hover:border-primary/50 transition-all rounded-2xl text-muted-foreground hover:text-primary"
								onClick={() => setCreateColumnOpen(true)}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Column
							</Button>
						</div>
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
				task={selectedTask as never}
			/>

			<Dialog open={createColumnOpen} onOpenChange={setCreateColumnOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Column</DialogTitle>
						<DialogDescription>
							Create a new stage for your task management board.
						</DialogDescription>
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
					<DialogFooter className="mt-6 gap-2">
						<Button
							variant="outline"
							onClick={() => setCreateColumnOpen(false)}
							className="flex-1 sm:flex-none h-12 rounded-xl"
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateColumn}
							disabled={isCreatingColumn}
							className="flex-1 sm:flex-none h-12 rounded-xl"
						>
							{isCreatingColumn ? "Creating..." : "Create Column"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</DndContext>
	);
}
