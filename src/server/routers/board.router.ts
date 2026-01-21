import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { board, boardColumn } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";

export const boardRouter = createTRPCRouter({
	getMainBoard: protectedProcedure.query(async ({ ctx }) => {
		let mainBoard = await ctx.db.query.board.findFirst({
			where: eq(board.userId, ctx.session.user.id),
			with: {
				columns: {
					orderBy: (columns, { asc }) => [asc(columns.order)],
					with: {
						tasks: {
							orderBy: (tasks, { asc }) => [asc(tasks.order)],
							with: {
								assignee: true,
							},
						},
					},
				},
			},
		});

		if (!mainBoard) {
			const boardId = crypto.randomUUID();
			await ctx.db
				.insert(board)
				.values({
					id: boardId,
					name: "My Tasks",
					userId: ctx.session.user.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			const defaultColumns = ["To Do", "In Progress", "Done"];
			await ctx.db.insert(boardColumn).values(
				defaultColumns.map((name, index) => ({
					id: crypto.randomUUID(),
					boardId: boardId,
					name: name,
					order: index,
					createdAt: new Date(),
					updatedAt: new Date(),
				})),
			);

			// Refetch with relations
			mainBoard = await ctx.db.query.board.findFirst({
				where: eq(board.id, boardId),
				with: {
					columns: {
						orderBy: (columns, { asc }) => [asc(columns.order)],
						with: {
							tasks: {
								orderBy: (tasks, { asc }) => [asc(tasks.order)],
								with: {
									assignee: true,
								},
							},
						},
					},
				},
			});
		}

		return mainBoard;
	}),

	createColumn: protectedProcedure
		.input(z.object({ boardId: z.string(), name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify board ownership
			const userBoard = await ctx.db.query.board.findFirst({
				where: and(
					eq(board.id, input.boardId),
					eq(board.userId, ctx.session.user.id),
				),
			});

			if (!userBoard) {
				throw new Error("Forbidden: Board access denied");
			}

			const columns = await ctx.db.query.boardColumn.findMany({
				where: eq(boardColumn.boardId, input.boardId),
			});
			const maxOrder = columns.reduce(
				(max, col) => Math.max(max, col.order),
				-1,
			);

			const newColumn = await ctx.db
				.insert(boardColumn)
				.values({
					id: crypto.randomUUID(),
					boardId: input.boardId,
					name: input.name,
					order: maxOrder + 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();
			return newColumn[0];
		}),

	updateColumn: protectedProcedure
		.input(z.object({ id: z.string(), name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify column belongs to user board
			const column = await ctx.db.query.boardColumn.findFirst({
				where: eq(boardColumn.id, input.id),
				with: { board: true },
			});

			if (!column || column.board.userId !== ctx.session.user.id) {
				throw new Error("Forbidden: Column access denied");
			}

			const updated = await ctx.db
				.update(boardColumn)
				.set({ name: input.name, updatedAt: new Date() })
				.where(eq(boardColumn.id, input.id))
				.returning();
			return updated[0];
		}),

	deleteColumn: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify column belongs to user board
			const column = await ctx.db.query.boardColumn.findFirst({
				where: eq(boardColumn.id, input.id),
				with: { board: true },
			});

			if (!column || column.board.userId !== ctx.session.user.id) {
				throw new Error("Forbidden: Column access denied");
			}

			await ctx.db.delete(boardColumn).where(eq(boardColumn.id, input.id));
			return { success: true };
		}),
});
