import { initTRPC } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import { ZodError } from "zod";
import { db } from "@/db";
import { auth } from "@/lib/auth";

export const createTRPCContext = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return {
		session,
		db,
	};
});

const t = initTRPC.context<typeof createTRPCContext>().create({
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (!ctx.session) {
		throw new Error("Unauthorized");
	}
	return next({
		ctx: {
			session: ctx.session,
			db: ctx.db,
		},
	});
});
