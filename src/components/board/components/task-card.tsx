import { MoreHorizontal } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Task {
	id: string;
	columnId: string;
	title: string;
	description: string | null;
	priority: "low" | "medium" | "high" | null;
	label: string | null;
	order: number;
	createdAt: string;
	assignee?: {
		id: string;
		name: string;
		image: string | null;
	} | null;
}

interface TaskCardProps {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => void;
}

const getLabelColor = (label: string) => {
	const colors = [
		"bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
		"bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
		"bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
		"bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
	];
	const index = label.length % colors.length;
	return colors[index];
};

export const TaskCard = memo(function TaskCard({
	task,
	onEdit,
	onDelete,
}: TaskCardProps) {
	const priority = task.priority || "medium";
	const labelColor = task.label ? getLabelColor(task.label) : "";

	return (
		<Card
			className="p-4 mb-3 hover:shadow-md transition-shadow group relative bg-card cursor-pointer"
			onClick={() => onEdit(task)}
		>
			<div className="flex justify-between items-start mb-2">
				{task.label ? (
					<span
						className={cn(
							"text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase",
							labelColor,
						)}
					>
						{task.label}
					</span>
				) : (
					<div />
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							className="text-destructive"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(task.id);
							}}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<h3 className="font-semibold text-sm mb-3 leading-tight">{task.title}</h3>

			<div className="flex items-center justify-between mt-auto">
				<div className="flex items-center gap-2">
					{/* Priority Indicator if High */}
					{priority === "high" && (
						<div
							className="text-red-500 flex items-center"
							title="High Priority"
						>
							<span className="text-[10px] font-bold">!</span>
						</div>
					)}
				</div>

				{task.assignee && (
					<div className="flex -space-x-2">
						{task.assignee.image ? (
							<img
								src={task.assignee.image}
								alt={task.assignee.name}
								className="w-6 h-6 rounded-full border-2 border-background object-cover"
							/>
						) : (
							<div className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
								{task.assignee.name.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
				)}
			</div>
		</Card>
	);
});
