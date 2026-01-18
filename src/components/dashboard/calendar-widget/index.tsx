"use client";

import { trpc } from "@/trpc/client";
import { CalendarWidgetView } from "./calendar-widget.view";

interface Task {
	id: string;
	title: string;
	time: string;
	description: string;
}

export function CalendarWidget() {
	const { data: tasks, isLoading } = trpc.getTasks.useQuery();

	const formattedDate = new Date().toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<CalendarWidgetView
			tasks={tasks as Task[] | undefined}
			isLoading={isLoading}
			formattedDate={formattedDate}
		/>
	);
}
