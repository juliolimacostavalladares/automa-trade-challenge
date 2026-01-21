"use client";

import { Activity, CheckCircle2, Clock } from "lucide-react";
import { Greeting } from "@/components/dashboard/greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

export default function DashboardPage() {
	const { data: board } = trpc.getMainBoard.useQuery();

	const allTasks = board?.columns.flatMap((col) => col.tasks) || [];
	const totalTasks = allTasks.length;

	const completedTasks =
		board?.columns.find((col) => col.name.toLowerCase() === "done")?.tasks
			.length || 0;

	const pendingTasks = totalTasks - completedTasks;

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<Greeting />

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card className="hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Tasks
						</CardTitle>
						<Activity className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{totalTasks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Across your workspace
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Completed
						</CardTitle>
						<CheckCircle2 className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{completedTasks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Tasks moved to Done
						</p>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition-shadow">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Pending
						</CardTitle>
						<Clock className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{pendingTasks}</div>
						<p className="text-xs text-muted-foreground mt-1">
							In Progress or To Do
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
