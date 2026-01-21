"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type TaskFormValues,
	taskSchema,
} from "@/components/schemas/board.schema";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/trpc/client";

interface TaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	boardId: string;
	columns: { id: string; name: string }[];
	defaultColumnId?: string;
	task?: {
		id: string;
		title: string;
		description: string | null;
		priority: "low" | "medium" | "high" | null;
		label: string | null;
		dueDate: string | null;
		columnId: string;
		assignee?: { id: string } | null;
	};
}

export function TaskDialog({
	open,
	onOpenChange,
	boardId,
	columns,
	defaultColumnId,
	task,
}: TaskDialogProps) {
	const utils = trpc.useUtils();
	const { data: users } = trpc.getUsers.useQuery();
	const isEditing = !!task;

	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			priority: "medium",
			columnId: defaultColumnId || columns[0]?.id || "",
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		getValues,
		formState: { errors },
	} = form;

	useEffect(() => {
		if (open) {
			if (task) {
				reset({
					title: task.title,
					description: task.description || "",
					priority: task.priority || "medium",
					label: task.label || "",
					columnId: task.columnId,
					dueDate: task.dueDate
						? new Date(task.dueDate).toISOString().split("T")[0]
						: "",
					assigneeId: task.assignee?.id || "unassigned",
				});
			} else {
				reset({
					title: "",
					description: "",
					priority: "medium",
					label: "",
					columnId: defaultColumnId || columns[0]?.id || "",
					dueDate: "",
					assigneeId: "unassigned",
				});
			}
		}
	}, [open, task, defaultColumnId, columns, reset]);

	const createTask = trpc.createTask.useMutation({
		onSuccess: () => {
			toast.success("Task created");
			onOpenChange(false);
			utils.getBoard.invalidate({ id: boardId });
		},
	});

	const updateTask = trpc.updateTask.useMutation({
		onSuccess: () => {
			toast.success("Task updated");
			onOpenChange(false);
			utils.getBoard.invalidate({ id: boardId });
		},
	});

	const onSubmit = (data: TaskFormValues) => {
		const payload = {
			...data,
			dueDate: data.dueDate || undefined,
			assigneeId:
				data.assigneeId === "unassigned" ? undefined : data.assigneeId,
		};
		if (isEditing && task) {
			updateTask.mutate({
				id: task.id,
				...payload,
				dueDate: data.dueDate || null,
			});
		} else {
			createTask.mutate(payload);
		}
	};

	const isPending = createTask.isPending || updateTask.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input id="title" {...register("title")} placeholder="Task title" />
						{errors.title && (
							<p className="text-sm text-destructive">
								{errors.title.message as string}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="column">Column</Label>
						<Select
							onValueChange={(val) => setValue("columnId", val)}
							defaultValue={getValues("columnId")}
							// Important: controlled value for Select when resetting form
							value={form.watch("columnId")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select column" />
							</SelectTrigger>
							<SelectContent>
								{columns.map((col) => (
									<SelectItem key={col.id} value={col.id}>
										{col.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.columnId && (
							<p className="text-sm text-destructive">
								{errors.columnId.message as string}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="assignee">Assignee</Label>
						<Select
							onValueChange={(val) => setValue("assigneeId", val)}
							defaultValue={getValues("assigneeId")}
							value={form.watch("assigneeId")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select assignee" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="unassigned">Unassigned</SelectItem>
								{users?.map((user) => (
									<SelectItem key={user.id} value={user.id}>
										{user.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="label">Label (Category)</Label>
						<Input
							id="label"
							{...register("label")}
							placeholder="e.g. Design, Bug, Marketing"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select
								onValueChange={(val: any) => setValue("priority", val)}
								defaultValue={getValues("priority")}
								value={form.watch("priority")}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="dueDate">Due Date</Label>
							<Input type="date" id="dueDate" {...register("dueDate")} />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							{...register("description")}
							placeholder="Task details..."
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
