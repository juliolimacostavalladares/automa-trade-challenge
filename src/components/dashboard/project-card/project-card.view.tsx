"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
	title: string;
	description: string;
	progress: number;
	members: number;
	variant?: "default" | "highlight";
}

export function ProjectCard({
	title,
	description,
	progress,
	members,
	variant = "default",
}: ProjectCardProps) {
	const isHighlight = variant === "highlight";

	return (
		<div
			className={cn(
				"p-6 rounded-3xl shadow-sm border transition-all duration-300 group hover:shadow-xl",
				isHighlight
					? "bg-foreground dark:bg-card border-foreground/10 hover:-translate-y-1"
					: "bg-card border-border",
			)}
		>
			<div className="flex justify-between items-start mb-6">
				<h3
					className={cn(
						"font-bold text-lg",
						isHighlight
							? "text-background dark:text-foreground"
							: "text-foreground",
					)}
				>
					{title}
				</h3>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						isHighlight
							? "text-background/60 dark:text-muted-foreground"
							: "text-muted-foreground",
					)}
				>
					<MoreHorizontal className="h-5 w-5" />
				</Button>
			</div>
			<p
				className={cn(
					"text-sm mb-6 line-clamp-2",
					isHighlight
						? "text-background/60 dark:text-muted-foreground"
						: "text-muted-foreground",
				)}
			>
				{description}
			</p>
			<div className="flex -space-x-2 mb-6">
				{["m1", "m2", "m3", "m4", "m5"].slice(0, members).map((id) => (
					<div
						key={`${title}-${id}`}
						className={cn(
							"w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px]",
							isHighlight
								? "border-foreground dark:border-card bg-background/20 dark:bg-muted text-background/60 dark:text-muted-foreground"
								: "border-card bg-muted text-muted-foreground",
						)}
					>
						U{i + 1}
					</div>
				))}
				{!isHighlight && (
					<div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-bold text-primary">
						+2
					</div>
				)}
			</div>
			<div>
				<div className="flex justify-between items-center text-xs font-bold mb-2">
					<span
						className={
							isHighlight
								? "text-background dark:text-foreground"
								: "text-foreground"
						}
					>
						Progress
					</span>
					<span
						className={
							isHighlight
								? "text-background dark:text-foreground"
								: "text-primary"
						}
					>
						{progress}%
					</span>
				</div>
				<div
					className={cn(
						"w-full h-2 rounded-full overflow-hidden",
						isHighlight
							? "bg-background/20 dark:bg-background/50"
							: "bg-background/50",
					)}
				>
					<div
						className={cn(
							"h-full transition-all duration-500",
							isHighlight ? "bg-background dark:bg-primary" : "bg-primary",
						)}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
