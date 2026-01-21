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
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { TiptapEditor } from "@/components/ui/tiptap-editor";
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
			onOpenChange(false);
			toast.success("Task created");
			utils.getMainBoard.invalidate();
		},
	});

	const updateTask = trpc.updateTask.useMutation({
		onSuccess: () => {
			onOpenChange(false);
			toast.success("Task updated");
			utils.getMainBoard.invalidate();
		},
	});

	const generateAI = trpc.generateDescription.useMutation({
		onSuccess: (data) => {
			setValue("description", data.description);
			toast.success("AI description generated!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleAIRequest = () => {
		const title = getValues("title");
		if (!title) {
			toast.error("Please enter a title first so AI has context.");
			return;
		}
		generateAI.mutate({
			title,
			currentDescription: getValues("description"),
		});
	};

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
			<DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden h-[100dvh] sm:h-[80vh] flex flex-col sm:max-w-4xl sm:rounded-3xl">
				<DialogTitle className="sr-only">
					{isEditing ? "Edit Task" : "Create New Task"}
				</DialogTitle>
				<DialogDescription className="sr-only">
					Fill in the details for your task.
				</DialogDescription>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-1 flex-col md:flex-row min-h-0"
				>
					<div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
						<div className="p-6 md:p-8 space-y-6 flex-1">
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

							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
								>
									Description
								</Label>
								<TiptapEditor
									content={watch("description") || ""}
									onChange={(html) => setValue("description", html)}
									onAIRequest={handleAIRequest}
									isAILoading={generateAI.isPending}
								/>
							</div>

							{/* Mobile-only settings stack */}
							<div className="md:hidden space-y-6 pt-6 border-t border-border/50">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Status
										</Label>
										<Select
											onValueChange={(val) => setValue("columnId", val)}
											defaultValue={getValues("columnId")}
											value={watch("columnId")}
										>
											<SelectTrigger className="w-full bg-background border-border/60 rounded-xl">
												<SelectValue placeholder="Status" />
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
										<Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Priority
										</Label>
										<Select
											onValueChange={(val) =>
												setValue("priority", val as "low" | "medium" | "high")
											}
											defaultValue={getValues("priority")}
											value={watch("priority")}
										>
											{" "}
											<SelectTrigger className="w-full bg-background border-border/60 rounded-xl">
												<SelectValue placeholder="Priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">Low</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="high">High</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Assignee
										</Label>
										<Select
											onValueChange={(val) => setValue("assigneeId", val)}
											defaultValue={getValues("assigneeId")}
											value={watch("assigneeId")}
										>
											<SelectTrigger className="w-full bg-background border-border/60 rounded-xl">
												<div className="flex items-center gap-2">
													<User className="h-3.5 w-3.5 text-muted-foreground" />
													<SelectValue placeholder="Assignee" />
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
										<Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Label
										</Label>
										<div className="relative">
											<Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
											<Input
												{...register("label")}
												placeholder="Label"
												className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Sticky footer for mobile buttons */}
						<div className="md:hidden sticky bottom-0 p-4 bg-background border-t border-border flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
								className="flex-1 rounded-xl h-12"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isPending}
								className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20"
							>
								{isPending
									? isEditing
										? "Saving..."
										: "Creating..."
									: isEditing
										? "Save"
										: "Create"}
							</Button>
						</div>
					</div>

					{/* Desktop Sidebar */}
					<div className="hidden md:flex w-80 bg-muted/30 border-l border-border p-6 flex-col overflow-y-auto custom-scrollbar">
						<div className="space-y-6 flex-1">
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
										onValueChange={(val) =>
											setValue("priority", val as "low" | "medium" | "high")
										}
										defaultValue={getValues("priority")}
										value={watch("priority")}
									>
										{" "}
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
						</div>

						<div className="pt-6 mt-auto">
							<Button type="submit" disabled={isPending} className="w-full">
								{isPending
									? isEditing
										? "Saving..."
										: "Creating..."
									: isEditing
										? "Save Changes"
										: "Create Task"}
							</Button>
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
								className="w-full mt-2"
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
