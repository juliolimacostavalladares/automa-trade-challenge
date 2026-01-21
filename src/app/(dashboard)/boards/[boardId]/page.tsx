import { notFound } from "next/navigation";
import { Board } from "@/components/board/board";
import { trpcServer } from "@/trpc/server";

interface PageProps {
	params: Promise<{ boardId: string }>;
}

export default async function BoardPage({ params }: PageProps) {
	const { boardId } = await params;
	const caller = await trpcServer();
	const board = await caller.getBoard({ id: boardId });

	if (!board) {
		return notFound();
	}

	// Serialize dates for client component

	const serializedColumns = board.columns.map((col) => ({
		...col,

		tasks: col.tasks.map((task) => ({
			...task,

			dueDate: task.dueDate ? task.dueDate.toISOString() : null,

			createdAt: task.createdAt.toISOString(),
		})),
	}));

	return (
		<div className="flex flex-col h-full space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>

					{board.description && (
						<p className="text-muted-foreground">{board.description}</p>
					)}
				</div>
			</div>

			<Board boardId={board.id} initialColumns={serializedColumns} />
		</div>
	);
}
