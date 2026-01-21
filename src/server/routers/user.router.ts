import { eq } from "drizzle-orm";
import { z } from "zod";
import { user as userTable } from "../../db/schema";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "../../trpc/init";

export const userRouter = createTRPCRouter({
	getProfile: protectedProcedure.query(async ({ ctx }) => {
		return ctx.session.user;
	}),

	getUsers: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.user.findMany({
			where: (user, { ne }) => ne(user.status, "deleted"),
			orderBy: (user, { desc }) => [desc(user.createdAt)],
		});
	}),

	inviteUser: adminProcedure
		.input(
			z.object({
				name: z.string().min(2),
				email: z.string().email(),
				role: z.enum(["admin", "member", "viewer"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const newUser = await ctx.db
				.insert(userTable)
				.values({
					id: crypto.randomUUID(),
					name: input.name,
					email: input.email,
					role: input.role,
					status: "pending",
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();
			return newUser[0];
		}),

	updateUser: adminProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(2).optional(),
				email: z.string().email().optional(),
				role: z.enum(["admin", "member", "viewer"]).optional(),
				status: z.enum(["active", "inactive", "pending", "deleted"]).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			const updatedUser = await ctx.db
				.update(userTable)
				.set({
					...data,
					updatedAt: new Date(),
				})
				.where(eq(userTable.id, id))
				.returning();
			return updatedUser[0];
		}),

	deleteUser: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const deletedUser = await ctx.db
				.update(userTable)
				.set({
					status: "deleted",
					updatedAt: new Date(),
				})
				.where(eq(userTable.id, input.id))
				.returning();
			return deletedUser[0];
		}),
});
