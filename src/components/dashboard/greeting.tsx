"use client";

import { trpc } from "@/trpc/client";

export function Greeting() {
	const { data: user } = trpc.getProfile.useQuery();
	const { data: tasks } = trpc.getTasks.useQuery();

	const firstName = user?.name?.split(" ")[0];
	const taskCount = tasks?.length || 0;

	return (
		<section className="mt-4">
			<p className="text-muted-foreground text-lg font-medium opacity-80">
				Hello, {firstName}!
			</p>
			<h1 className="font-display font-bold text-5xl text-foreground mt-1 leading-tight">
				{taskCount === 0 ? (
					<>
						You have no <span className="text-primary">tasks</span> today
					</>
				) : (
					<>
						You've got{" "}
						<span className="text-primary">
							{taskCount} {taskCount === 1 ? "task" : "tasks"}
						</span>{" "}
						today
					</>
				)}
			</h1>
		</section>
	);
}
