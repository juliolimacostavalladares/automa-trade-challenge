"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type TaskFormValues,
	taskSchema,
} from "@/components/schemas/board.schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
		watch,
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
					assigneeId: task.assignee?.id || "unassigned",
				});
			} else {
				reset({
					title: "",
					description: "",
					priority: "medium",
					label: "",
					columnId: defaultColumnId || columns[0]?.id || "",
					assigneeId: "unassigned",
				});
			}
		}
	}, [open, task, defaultColumnId, columns, reset]);

	const createTask = trpc.createTask.useMutation({
		onSuccess: () => {
			utils.getMainBoard.invalidate();
			toast.success("Task created");
			onOpenChange(false);
		},
	});

	const updateTask = trpc.updateTask.useMutation({
		onSuccess: () => {
			toast.success("Task updated");
			onOpenChange(false);
			utils.getMainBoard.invalidate();
		},
	});

	const onSubmit = (data: TaskFormValues) => {
		const payload = {
			...data,
			assigneeId:
				data.assigneeId === "unassigned" ? undefined : data.assigneeId,
		};
		if (isEditing && task) {
			updateTask.mutate({
				id: task.id,
				...payload,
			});
		} else {
			createTask.mutate(payload);
		}
	};

	const isPending = createTask.isPending || updateTask.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden h-[80vh] flex flex-col sm:max-w-4xl">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col md:flex-row h-full"
				>
					<div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
						<div className="space-y-6 flex-1">
							<div>
								<Input
									id="title"
									{...register("title")}
									placeholder="Task Title"
									className="text-2xl md:text-3xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto"
								/>
								{errors.title && (
									<p className="text-sm text-destructive mt-1">
										{errors.title.message as string}
									</p>
								)}
							</div>

							<div className="space-y-2 h-full flex flex-col">
								<Label
									htmlFor="description"
									className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
								>
									Description
								</Label>
								<textarea
									id="description"
									{...register("description")}
									placeholder="Add a detailed description..."
									className="flex-1 w-full min-h-50 resize-none bg-transparent border-none focus:outline-none text-base leading-relaxed placeholder:text-muted-foreground/40"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 mt-6 pt-4 border-t md:hidden">
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</div>

					<div className="w-full md:w-80 bg-muted/30 border-l border-border p-6 space-y-6 overflow-y-auto">
						<div className="space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-muted-foreground uppercase">
									Status
								</Label>
								<Select
									onValueChange={(val) => setValue("columnId", val)}
									defaultValue={getValues("columnId")}
									value={watch("columnId")}
								>
									<SelectTrigger className="w-full bg-background border-border">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{columns.map((col) => (
											<SelectItem key={col.id} value={col.id}>
												{col.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-muted-foreground uppercase">
									Priority
								</Label>
								<Select
									onValueChange={(val: any) => setValue("priority", val)}
									defaultValue={getValues("priority")}
									value={watch("priority")}
								>
									<SelectTrigger className="w-full bg-background border-border">
										<SelectValue placeholder="Select priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-muted-foreground uppercase">
									Assignee
								</Label>
								<Select
									onValueChange={(val) => setValue("assigneeId", val)}
									defaultValue={getValues("assigneeId")}
									value={watch("assigneeId")}
								>
									<SelectTrigger className="w-full bg-background border-border">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<SelectValue placeholder="Unassigned" />
										</div>
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

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-muted-foreground uppercase">
									Label
								</Label>
								<div className="relative">
									<Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										{...register("label")}
										placeholder="e.g. Bug"
										className="pl-9 bg-background border-border"
									/>
								</div>
							</div>
						</div>

						<div className="hidden md:flex flex-col gap-2 pt-6 mt-auto">
							<Button type="submit" disabled={isPending} className="w-full">
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
								className="w-full"
							>
								Cancel
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
