"use client";

import { trpc } from "@/trpc/client";
import { GreetingView } from "./greeting.view";

export function Greeting() {
	const { data: user } = trpc.getProfile.useQuery();
	const { data: tasks } = trpc.getTasks.useQuery();

	const firstName = user?.name?.split(" ")[0] || "there";
	const taskCount = tasks?.length || 0;

	return <GreetingView firstName={firstName} taskCount={taskCount} />;
}
