import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc/init";

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
});

export type AppRouter = typeof appRouter;
