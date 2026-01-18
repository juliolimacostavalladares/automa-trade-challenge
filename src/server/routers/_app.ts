import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "../../trpc/init";

export const appRouter = createTRPCRouter({
	hello: publicProcedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.query((opts) => {
			return {
				greeting: `Hello ${opts.input.text}`,
			};
		}),

	getProfile: protectedProcedure.query(async ({ ctx }) => {
		// Here we could use the UserService to fetch more details if needed
		// but for now, returning the session user is enough.
		return ctx.session.user;
	}),

	getProjects: protectedProcedure.query(async () => {
		// This will be replaced by a database query later.
		// For now, return an empty array to show the Empty State in the UI.
		return [];
	}),

	getTasks: protectedProcedure.query(async () => {
		// Return empty array to trigger empty state in the sidebar
		return [];
	}),

	getRunningTimer: protectedProcedure.query(async () => {
		// Return null to show inactive state in the tracker
		return null;
	}),
});

export type AppRouter = typeof appRouter;
