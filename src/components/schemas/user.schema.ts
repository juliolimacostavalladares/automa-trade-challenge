import { z } from "zod";

export const inviteUserSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid email address"),
	role: z.enum(["admin", "member", "viewer"]),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z.object({
	id: z.string(),
	name: z.string().min(2, "Name is required").optional(),
	email: z.string().email("Invalid email address").optional(),
	role: z.enum(["admin", "member", "viewer"]).optional(),
	status: z.enum(["active", "inactive", "pending", "deleted"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
