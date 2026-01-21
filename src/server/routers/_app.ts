import { z } from "zod";
import {
	createTRPCRouter,
	mergeRouters,
	publicProcedure,
} from "../../trpc/init";
import { boardRouter } from "./board.router";
import { taskRouter } from "./task.router";
import { userRouter } from "./user.router";

const baseRouter = createTRPCRouter({
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

export const appRouter = mergeRouters(
	baseRouter,
	boardRouter,
	taskRouter,
	userRouter,
);

export type AppRouter = typeof appRouter;
