"use client";

import { Activity, CheckCircle2, Clock } from "lucide-react";
import { Greeting } from "@/components/dashboard/greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

export default function DashboardPage() {
	const { data: tasks } = trpc.getTasks.useQuery();

	const totalTasks = tasks?.length || 0;
	// Mocking other stats for now as we don't have column info in simple getTasks list yet
	// A real implementation would fetch tasks with column relations or aggregated stats.

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
						<div className="text-3xl font-bold">--</div>
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
						<div className="text-3xl font-bold">--</div>
						<p className="text-xs text-muted-foreground mt-1">
							In Progress or To Do
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="rounded-xl border bg-card text-card-foreground shadow">
				<div className="flex flex-col space-y-1.5 p-6">
					<h3 className="font-semibold leading-none tracking-tight">
						Recent Activity
					</h3>
					<p className="text-sm text-muted-foreground">
						Latest updates from your team.
					</p>
				</div>
				<div className="p-6 pt-0">
					<div className="space-y-4">
						{tasks?.slice(0, 5).map((task) => (
							<div key={task.id} className="flex items-center gap-4">
								<div className="w-2 h-2 rounded-full bg-primary" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium leading-none">
										{task.title}
									</p>
									<p className="text-xs text-muted-foreground">
										Created on {new Date(task.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
						{totalTasks === 0 && (
							<p className="text-sm text-muted-foreground">
								No activity recorded yet.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
