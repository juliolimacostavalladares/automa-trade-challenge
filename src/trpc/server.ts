import { cache } from "react";
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "./init";

export const trpcServer = cache(async () => {
	const context = await createTRPCContext();
	return appRouter.createCaller(context);
});
