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
});

export type AppRouter = typeof appRouter;
