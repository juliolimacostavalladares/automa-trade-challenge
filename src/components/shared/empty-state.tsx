import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description: string;
	actionButton?: {
		label: string;
		onClick: () => void;
	};
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionButton,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-3xl border border-border shadow-sm">
			{Icon && <Icon className="w-16 h-16 text-muted-foreground mb-4" />}
			<h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
			<p className="text-muted-foreground mb-6 max-w-md">{description}</p>
			{actionButton && (
				<Button onClick={actionButton.onClick} className="h-12 rounded-xl">
					{actionButton.label}
				</Button>
			)}
		</div>
	);
}
