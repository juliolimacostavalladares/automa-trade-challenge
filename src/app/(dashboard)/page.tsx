"use client";

import { trpc } from "@/trpc/client";

export default function DashboardPage() {
	const { data: user, isLoading } = trpc.getProfile.useQuery();

	if (isLoading) {
		return <div className="text-muted-foreground">Loading profile...</div>;
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					Dashboard
				</h1>
				<p className="text-muted-foreground">
					Welcome back,{" "}
					<span className="font-semibold text-foreground">{user?.name}</span>!
				</p>
			</div>
		</div>
	);
}
