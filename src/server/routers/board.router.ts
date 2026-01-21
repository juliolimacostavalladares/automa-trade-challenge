import { eq } from "drizzle-orm";
import { z } from "zod";
import { board, boardColumn } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";

export const boardRouter = createTRPCRouter({
	getBoards: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.query.board.findMany({
			orderBy: (board, { desc }) => [desc(board.createdAt)],
			with: {
				columns: true,
			},
		});
	}),

	createBoard: protectedProcedure
		.input(
			z.object({ name: z.string().min(1), description: z.string().optional() }),
		)
		.mutation(async ({ ctx, input }) => {
			const boardId = crypto.randomUUID();
			const newBoard = await ctx.db
				.insert(board)
				.values({
					id: boardId,
					name: input.name,
					description: input.description,
					userId: ctx.session.user.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			const defaultColumns = ["To Do", "In Progress", "In Review", "Done"];
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

			return newBoard[0];
		}),

	getBoard: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			return await ctx.db.query.board.findFirst({
				where: eq(board.id, input.id),
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
		}),

	deleteBoard: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(board).where(eq(board.id, input.id));
			return { success: true };
		}),

	createColumn: protectedProcedure
		.input(z.object({ boardId: z.string(), name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Get max order
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
			await ctx.db.delete(boardColumn).where(eq(boardColumn.id, input.id));
			return { success: true };
		}),
});
