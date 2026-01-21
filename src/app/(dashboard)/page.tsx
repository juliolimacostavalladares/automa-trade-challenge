"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";
import { Greeting } from "@/components/dashboard/greeting";
import { ProjectCard } from "@/components/dashboard/project-card";
import { UsersTable } from "@/components/users/users-table";
import { trpc } from "@/trpc/client";

export default function DashboardPage() {
	const { data: boards, isLoading: isLoadingBoards } =
		trpc.getBoards.useQuery();

	return (
		<div className="space-y-8">
			<Greeting />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Your Boards</h2>
						<CreateBoardDialog />
					</div>

					{isLoadingBoards ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="h-48 rounded-xl bg-muted animate-pulse"
								/>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{boards?.map((board) => (
								<Link key={board.id} href={`/boards/${board.id}`}>
									<ProjectCard
										title={board.name}
										description={board.description || "No description"}
										progress={0} // We can calculate progress later
										members={0}
									/>
								</Link>
							))}
							{boards?.length === 0 && (
								<div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
									No boards found. Create one to get started!
								</div>
							)}
						</div>
					)}

					<div className="pt-8">
						<h2 className="text-xl font-bold mb-4">Team Members</h2>
						<UsersTable />
					</div>
				</div>

				<div className="space-y-8">
					{/* Sidebar widgets or similar could go here */}
				</div>
			</div>
		</div>
	);
}
