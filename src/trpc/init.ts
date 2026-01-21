import { initTRPC } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import { ZodError } from "zod";
import { db } from "@/db";
import type { User } from "@/db/schema";
import { auth } from "@/lib/auth";

interface ContextSession {
	user: User | null;
	session: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string | null | undefined;
		userAgent?: string | null | undefined;
	} | null;
}

export const createTRPCContext = cache(async () => {
	const betterAuthSession = await auth.api.getSession({
		headers: await headers(),
	});

	let sessionUser: User | null = null;

	if (betterAuthSession?.user?.id) {
		sessionUser =
			(await db.query.user.findFirst({
				where: (userTable, { eq }) =>
					eq(userTable.id, betterAuthSession.user?.id as string),
			})) ?? null;
	}

	const session: ContextSession = {
		user: sessionUser,
		session: betterAuthSession?.session || null,
	};

	return {
		session,
		db,
	};
});

interface ProtectedContext {
	session: { user: User; session: NonNullable<ContextSession["session"]> };
	db: typeof db;
}

const t = initTRPC.context<typeof createTRPCContext>().create({
	errorFormatter({ shape, error }) {
		const { stack, ...restData } = shape.data;
		let message = shape.message;

		if (
			shape.data.code === "INTERNAL_SERVER_ERROR" &&
			!(error.cause instanceof ZodError)
		) {
			message = "Internal server error.";
		} else if (message.includes("Failed query:")) {
			message = "Internal server error.";
		}

		return {
			...shape,
			message,
			data: {
				...restData,
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
	if (!ctx.session || !ctx.session.user || !ctx.session.session) {
		throw new Error("Unauthorized");
	}
	return next({
		ctx: {
			session: { user: ctx.session.user, session: ctx.session.session },
			db: ctx.db,
		} as ProtectedContext,
	});
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session.user.role !== "admin") {
		throw new Error("Forbidden: Admin access required");
	}
	return next({ ctx });
});
