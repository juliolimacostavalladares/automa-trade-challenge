"use client";

import { useConfirmStore } from "@/components/store/confirm-store";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export function GlobalConfirmDialog() {
	const { isOpen, options, handleConfirm, handleCancel } = useConfirmStore();

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{options.title}</DialogTitle>
					{options.description && (
						<DialogDescription>{options.description}</DialogDescription>
					)}
				</DialogHeader>
				<DialogFooter className="mt-6 gap-2">
					<Button
						variant="outline"
						onClick={handleCancel}
						className="flex-1 sm:flex-none h-12 rounded-xl"
					>
						{options.cancelText || "Cancel"}
					</Button>
					<Button
						variant={options.variant || "default"}
						onClick={handleConfirm}
						className="flex-1 sm:flex-none h-12 rounded-xl shadow-lg shadow-primary/10"
					>
						{options.confirmText || "Confirm"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
