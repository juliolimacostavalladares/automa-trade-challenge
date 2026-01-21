"use client";

import { Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

export default function BoardsPage() {
	const { data: boards, isLoading } = trpc.getBoards.useQuery();
	const utils = trpc.useUtils();

	const deleteBoard = trpc.deleteBoard.useMutation({
		onSuccess: () => {
			toast.success("Board deleted successfully");
			utils.getBoards.invalidate();
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const handleDelete = (e: React.MouseEvent, id: string) => {
		e.preventDefault(); // Prevent navigation
		if (confirm("Are you sure you want to delete this board?")) {
			deleteBoard.mutate({ id });
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Boards</h1>
					<p className="text-muted-foreground mt-1">
						Manage your projects and tasks.
					</p>
				</div>
				<CreateBoardDialog />
			</div>

			{isLoading ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
					))}
				</div>
			) : boards?.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-muted-foreground/25">
					<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
						<Calendar className="h-6 w-6 text-primary" />
					</div>
					<h3 className="text-lg font-semibold">No boards created</h3>
					<p className="text-muted-foreground max-w-sm mt-1 mb-4">
						Create your first board to start organizing tasks.
					</p>
					<CreateBoardDialog />
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{boards?.map((board) => (
						<Link key={board.id} href={`/boards/${board.id}`}>
							<Card className="p-6 h-full hover:shadow-md transition-shadow cursor-pointer group relative">
								<div className="flex justify-between items-start mb-4">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
										{board.name.charAt(0).toUpperCase()}
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 text-muted-foreground hover:text-destructive"
										onClick={(e) => handleDelete(e, board.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
								<h3 className="font-semibold text-lg mb-1">{board.name}</h3>
								<p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
									{board.description || "No description"}
								</p>
								<div className="flex items-center text-xs text-muted-foreground mt-auto">
									<Calendar className="h-3 w-3 mr-1" />
									<span>
										Created {new Date(board.createdAt).toLocaleDateString()}
									</span>
								</div>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
