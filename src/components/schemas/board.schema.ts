import { z } from "zod";

export const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	priority: z.enum(["low", "medium", "high"]),
	label: z.string().optional(),
	columnId: z.string().min(1, "Column is required"),
	dueDate: z.string().optional(),
	assigneeId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const createBoardSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export type CreateBoardFormValues = z.infer<typeof createBoardSchema>;
