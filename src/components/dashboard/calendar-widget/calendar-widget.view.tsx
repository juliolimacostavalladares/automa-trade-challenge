"use client";

import { CalendarDays, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
	id: string;
	title: string;
	time: string;
	description: string;
}

interface CalendarWidgetViewProps {
	tasks?: Task[];
	isLoading: boolean;
	formattedDate: string;
}

export function CalendarWidgetView({
	tasks,
	isLoading,
	formattedDate,
}: CalendarWidgetViewProps) {
	const today = new Date().getDate();
	const hasTasks = tasks && tasks.length > 0;

	return (
		<div className="bg-card p-6 rounded-3xl border border-border h-full shadow-sm">
			<div className="flex items-center justify-between mb-8">
				<div>
					<p className="text-sm text-muted-foreground opacity-60">
						{formattedDate}
					</p>
					<h2 className="font-display font-bold text-3xl text-foreground">
						Today
					</h2>
				</div>
				<Button className="bg-foreground text-background hover:opacity-90 rounded-2xl h-auto py-3 px-4 gap-2">
					<Plus className="h-5 w-5" />
					<span className="text-xs font-bold uppercase tracking-wider">
						Add tasks
					</span>
				</Button>
			</div>

			{/* Minimal Calendar Mock */}
			<div className="grid grid-cols-7 gap-y-4 text-center mb-10">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						key={day}
						className="text-[10px] font-bold text-muted-foreground/40 uppercase"
					>
						{day}
					</div>
				))}
				{[...Array(14)].map((_, i) => {
					const dayNum = i + 1;
					const isToday = dayNum === today;
					return (
						<div
							key={dayNum}
							className={cn(
								"text-sm font-medium relative py-1",
								isToday ? "text-primary font-bold" : "text-foreground",
							)}
						>
							{dayNum}
							{isToday && (
								<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
							)}
						</div>
					);
				})}
			</div>

			{/* Timeline */}
			<div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-border/50 min-h-[200px]">
				{isLoading ? (
					<div className="pl-10 space-y-4">
						<div className="h-20 bg-muted/50 animate-pulse rounded-2xl" />
						<div className="h-20 bg-muted/50 animate-pulse rounded-2xl" />
					</div>
				) : hasTasks ? (
					tasks.map((task) => (
						<div key={task.id} className="relative pl-10">
							<div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary/20 border-4 border-card flex items-center justify-center">
								<div className="w-1.5 h-1.5 bg-primary rounded-full" />
							</div>
							<div className="bg-primary rounded-3xl p-5 shadow-lg shadow-primary/20 text-white">
								<div className="flex justify-between items-start mb-2">
									<h4 className="font-bold">{task.title}</h4>
									<span className="text-[10px] font-bold opacity-80">
										{task.time}
									</span>
								</div>
								<p className="text-xs opacity-90 mb-4">{task.description}</p>
								<div className="flex items-center justify-between">
									<div className="flex -space-x-2">
										<div className="w-6 h-6 rounded-full border border-primary bg-white/20" />
									</div>
									<div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
										<Check className="h-4 w-4" />
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="pl-10 py-8 flex flex-col items-center text-center">
						<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
							<CalendarDays className="h-6 w-6" />
						</div>
						<p className="text-sm font-medium text-foreground">
							No tasks for today
						</p>
						<p className="text-xs text-muted-foreground px-4">
							Enjoy your free time or start planning your next move.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
