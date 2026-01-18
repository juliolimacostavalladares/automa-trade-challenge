"use client";

import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Greeting } from "@/components/dashboard/greeting";
import { ProjectCard } from "@/components/dashboard/project-card";
import { TimeTracker } from "@/components/dashboard/time-tracker";
import { Button } from "@/components/ui/button";

import { trpc } from "@/trpc/client";

interface Project {
	title: string;
	description: string;
	progress: number;
	members: number;
	variant?: "default" | "highlight";
}

export default function DashboardPage() {
	const { data: projects, isLoading: isLoadingProjects } =
		trpc.getProjects.useQuery() as {
			data: Project[] | undefined;
			isLoading: boolean;
		};

	const hasProjects = projects && projects.length > 0;

	return (
		<div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<Greeting />

			<div className="grid grid-cols-12 gap-8">
				<div className="col-span-12 lg:col-span-8 space-y-8">
					{/* Tabs */}
					<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
						<Button className="rounded-full px-6 shadow-lg shadow-primary/20">
							Recently
						</Button>
						<Button
							variant="ghost"
							className="rounded-full px-6 bg-card text-muted-foreground hover:bg-primary/10"
						>
							Today
						</Button>
						<Button
							variant="ghost"
							className="rounded-full px-6 bg-card text-muted-foreground hover:bg-primary/10"
						>
							Upcoming
						</Button>
						<Button
							variant="ghost"
							className="rounded-full px-6 bg-card text-muted-foreground hover:bg-primary/10"
						>
							Later
						</Button>
					</div>

					{/* Project Grid or Empty State */}
					{isLoadingProjects ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="h-48 bg-card/50 animate-pulse rounded-3xl"
								/>
							))}
						</div>
					) : hasProjects ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{projects.map((project) => (
								<ProjectCard
									key={project.title}
									title={project.title}
									description={project.description}
									progress={project.progress}
									members={project.members}
									variant={project.variant}
								/>
							))}
						</div>
					) : (
						<EmptyState
							title="No projects yet"
							description="It looks like you haven't created any projects. Start by adding your first task or project to track your progress."
							actionLabel="Create Project"
							onAction={() => console.log("Create project clicked")}
						/>
					)}

					<TimeTracker />
				</div>

				{/* Right Column - Calendar Widget */}
				<div className="col-span-12 lg:col-span-4">
					<CalendarWidget />
				</div>
			</div>
		</div>
	);
}
