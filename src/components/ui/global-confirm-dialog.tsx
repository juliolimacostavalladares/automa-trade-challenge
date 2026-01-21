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
				<DialogFooter>
					<Button variant="outline" onClick={handleCancel}>
						{options.cancelText || "Cancel"}
					</Button>
					<Button
						variant={options.variant || "default"}
						onClick={handleConfirm}
					>
						{options.confirmText || "Confirm"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
