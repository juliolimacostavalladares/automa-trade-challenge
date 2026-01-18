"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
}

export function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/30 border border-dashed border-border rounded-3xl animate-in fade-in zoom-in duration-500">
			<div className="relative w-40 h-40 mb-6 opacity-80">
				<Image
					src="/mascote-nobg.svg"
					alt="Empty state mascot"
					fill
					className="object-contain grayscale contrast-75 brightness-125 dark:brightness-75 dark:grayscale-0 dark:opacity-50"
				/>
			</div>
			<h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
			<p className="text-muted-foreground max-w-sm mb-8">{description}</p>
			{actionLabel && (
				<Button
					onClick={onAction}
					className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
				>
					<Plus className="mr-2 h-5 w-5" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
