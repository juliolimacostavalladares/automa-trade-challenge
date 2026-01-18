"use client";

import { trpc } from "@/trpc/client";
import { TimeTrackerView } from "./time-tracker.view";

export function TimeTracker() {
	const { data: timer, isLoading } = trpc.getRunningTimer.useQuery();

	return <TimeTrackerView timer={timer} isLoading={isLoading} />;
}
