"use client";

interface GreetingViewProps {
	firstName: string;
	taskCount: number;
}

export function GreetingView({ firstName, taskCount }: GreetingViewProps) {
	return (
		<section className="mt-4">
			<p className="text-muted-foreground text-lg font-medium opacity-80">
				Hello, {firstName}!
			</p>
			<h1 className="font-display font-bold text-5xl text-foreground mt-1 leading-tight">
				{taskCount === 0 ? (
					<>
						You have no
						<br />
						<span className="text-primary">tasks</span> today
					</>
				) : (
					<>
						You've got
						<br />
						<span className="text-primary">
							{taskCount} {taskCount === 1 ? "task" : "tasks"}
						</span>{" "}
						today
					</>
				)}
			</h1>
		</section>
	);
}
