import { useConfirmStore } from "@/components/store/confirm-store";

export function useConfirm() {
	const requestConfirm = useConfirmStore((state) => state.requestConfirm);

	return (
		options: {
			title: string;
			description?: string;
			confirmText?: string;
			cancelText?: string;
			variant?: "default" | "destructive";
		} = { title: "Are you sure?" },
	) => requestConfirm(options);
}
