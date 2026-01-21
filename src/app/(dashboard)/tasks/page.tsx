"use client";

import { Board } from "@/components/board/board";

export default function TasksPage() {
	return (
		<div className="flex flex-col h-full space-y-6 pb-6 animate-in fade-in duration-500">
			<div>
				<h1 className="text-4xl font-bold tracking-tight">Workboard</h1>
				<p className="text-muted-foreground mt-1">
					Manage and organize your tasks across different stages.
				</p>
			</div>
			<div className="flex-1 min-h-0">
				<Board />
			</div>
		</div>
	);
}
