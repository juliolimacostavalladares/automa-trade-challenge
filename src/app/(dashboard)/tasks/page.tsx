"use client";

import { Board } from "@/components/board/board";

export default function TasksPage() {
	return (
		<div className="flex flex-col h-full space-y-6 pb-6">
			<div className="flex-1 min-h-0">
				<Board />
			</div>
		</div>
	);
}
