"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	type CreateBoardFormValues,
	createBoardSchema,
} from "@/components/schemas/board.schema";
import { useBoardStore } from "@/components/store/board-store";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/trpc/client";

export function CreateBoardDialog() {
	const { isCreateBoardOpen, setCreateBoardOpen } = useBoardStore();
	const utils = trpc.useUtils();
	const form = useForm<CreateBoardFormValues>({
		resolver: zodResolver(createBoardSchema),
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	const createBoard = trpc.createBoard.useMutation({
		onSuccess: () => {
			toast.success("Board created successfully");
			setCreateBoardOpen(false);
			reset();
			utils.getBoards.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const onSubmit = (data: CreateBoardFormValues) => {
		createBoard.mutate(data);
	};

	return (
		<Dialog open={isCreateBoardOpen} onOpenChange={setCreateBoardOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2" onClick={() => setCreateBoardOpen(true)}>
					<Plus className="h-4 w-4" />
					Create Board
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Create Board</DialogTitle>
					<DialogDescription>
						Create a new board to manage tasks.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="Product Launch"
						/>
						{errors.name && (
							<p className="text-sm text-destructive">
								{errors.name.message as string}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description (Optional)</Label>
						<Input
							id="description"
							{...register("description")}
							placeholder="Q4 Roadmap"
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setCreateBoardOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={createBoard.isPending}>
							{createBoard.isPending ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
