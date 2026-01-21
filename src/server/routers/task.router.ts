import { and, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import { z } from "zod";
import { boardColumn, task } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";

export const taskRouter = createTRPCRouter({
	createTask: protectedProcedure
		.input(
			z.object({
				columnId: z.string().uuid().optional().or(z.string()), // Support both UUID and generic string for now
				title: z.string().min(1),
				description: z.string().optional(),
				priority: z.enum(["low", "medium", "high"]).optional(),
				label: z.string().optional(),
				assigneeId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify column belongs to user's board
			const column = await ctx.db.query.boardColumn.findFirst({
				where: eq(boardColumn.id, input.columnId),
				with: {
					board: true,
				},
			});

			if (!column || column.board.userId !== ctx.session.user.id) {
				throw new Error("Forbidden: Invalid column or board access");
			}

			const newTask = await ctx.db
				.insert(task)
				.values({
					id: crypto.randomUUID(),
					columnId: input.columnId,
					title: input.title,
					description: input.description,
					priority: input.priority || "medium",
					label: input.label,
					assigneeId: input.assigneeId || null,
					authorId: ctx.session.user.id,
					createdAt: new Date(),
					updatedAt: new Date(),
					order: 0,
				})
				.returning();
			return newTask[0];
		}),

	updateTask: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				priority: z.enum(["low", "medium", "high"]).optional(),
				label: z.string().optional(),
				columnId: z.string().optional(),
				order: z.number().optional(),
				assigneeId: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			// Ensure ownership
			const existingTask = await ctx.db.query.task.findFirst({
				where: and(eq(task.id, id), eq(task.authorId, ctx.session.user.id)),
			});

			if (!existingTask) {
				throw new Error("NotFound or Forbidden: Task access denied");
			}

			const updateData: any = { ...data, updatedAt: new Date() };

			const updated = await ctx.db
				.update(task)
				.set(updateData)
				.where(eq(task.id, id))
				.returning();
			return updated[0];
		}),

	deleteTask: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Ensure ownership
			const result = await ctx.db
				.delete(task)
				.where(
					and(eq(task.id, input.id), eq(task.authorId, ctx.session.user.id)),
				)
				.returning();

			if (result.length === 0) {
				throw new Error("NotFound or Forbidden: Task access denied");
			}

			return { success: true };
		}),

	moveTask: protectedProcedure
		.input(
			z.object({
				taskId: z.string(),
				newColumnId: z.string(),
				newIndex: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { taskId, newColumnId, newIndex } = input;

			const currentTask = await ctx.db.query.task.findFirst({
				where: and(eq(task.id, taskId), eq(task.authorId, ctx.session.user.id)),
			});

			if (!currentTask) {
				throw new Error("Task not found or access denied");
			}

			// Verify new column ownership
			const targetColumn = await ctx.db.query.boardColumn.findFirst({
				where: eq(boardColumn.id, newColumnId),
				with: { board: true },
			});

			if (!targetColumn || targetColumn.board.userId !== ctx.session.user.id) {
				throw new Error("Invalid target column");
			}

			const oldColumnId = currentTask.columnId;
			const oldIndex = currentTask.order;

			if (oldColumnId === newColumnId) {
				if (oldIndex === newIndex) return { success: true };

				if (oldIndex < newIndex) {
					await ctx.db
						.update(task)
						.set({
							order: sql`${task.order} - 1`,
							updatedAt: new Date(),
						})
						.where(
							and(
								eq(task.columnId, oldColumnId),
								gt(task.order, oldIndex),
								lte(task.order, newIndex),
							),
						);
				} else {
					await ctx.db
						.update(task)
						.set({
							order: sql`${task.order} + 1`,
							updatedAt: new Date(),
						})
						.where(
							and(
								eq(task.columnId, oldColumnId),
								gte(task.order, newIndex),
								lt(task.order, oldIndex),
							),
						);
				}
			} else {
				await ctx.db
					.update(task)
					.set({
						order: sql`${task.order} - 1`,
						updatedAt: new Date(),
					})
					.where(and(eq(task.columnId, oldColumnId), gt(task.order, oldIndex)));

				await ctx.db
					.update(task)
					.set({
						order: sql`${task.order} + 1`,
						updatedAt: new Date(),
					})
					.where(
						and(eq(task.columnId, newColumnId), gte(task.order, newIndex)),
					);
			}

			await ctx.db
				.update(task)
				.set({
					columnId: newColumnId,
					order: newIndex,
					updatedAt: new Date(),
				})
				.where(eq(task.id, taskId));

			return { success: true };
		}),

	getTasks: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.task.findMany({
			where: eq(task.authorId, ctx.session.user.id),
			orderBy: (task, { desc }) => [desc(task.createdAt)],
		});
	}),
});
