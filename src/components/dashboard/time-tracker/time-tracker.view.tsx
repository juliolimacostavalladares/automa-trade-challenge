"use client";

import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeTrackerViewProps {
	timer?: {
		projectName: string;
	} | null;
	isLoading: boolean;
}

export function TimeTrackerView({ timer, isLoading }: TimeTrackerViewProps) {
	if (isLoading) {
		return (
			<div className="h-32 bg-muted/30 animate-pulse rounded-3xl border border-border" />
		);
	}

	return (
		<div className="bg-card p-8 rounded-3xl border border-border flex items-center justify-between shadow-sm transition-all">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
					<Clock className="h-6 w-6" />
				</div>
				<div>
					<h3 className="font-bold text-xl text-foreground">
						{timer ? timer.projectName : "No active tracker"}
					</h3>
					<p className="text-sm text-muted-foreground">
						{timer
							? "Currently tracking your activity..."
							: "You can start tracking your daily activity now."}
					</p>
				</div>
			</div>
			<Button
				size="icon"
				className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
			>
				{timer ? (
					<Pause className="h-7 w-7 fill-current" />
				) : (
					<Play className="h-7 w-7 fill-current ml-1" />
				)}
			</Button>
		</div>
	);
}
