"use client";

import { Bell, Search, Users } from "lucide-react";
import { useUIStore } from "@/components/store/ui-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";

export function Header() {
	const { data: user } = trpc.getProfile.useQuery();
	const { globalSearchQuery, setGlobalSearchQuery } = useUIStore();

	return (
		<header className="h-20 flex items-center justify-between px-8 bg-transparent">
			<div className="relative w-full max-w-md group">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
				<Input
					className="w-full bg-card border-none rounded-2xl py-6 pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/40 text-sm transition-all shadow-sm"
					placeholder="Search tasks, people, or files..."
					value={globalSearchQuery}
					onChange={(e) => setGlobalSearchQuery(e.target.value)}
				/>
			</div>

			<div className="flex items-center gap-6">
				<Button
					variant="ghost"
					size="icon"
					className="relative text-muted-foreground rounded-full h-10 w-10"
				>
					<Bell className="h-6 w-6" />
					<span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
				</Button>

				<div className="flex items-center gap-3 pl-4 border-l border-border">
					<div className="text-right hidden sm:block">
						<p className="text-sm font-bold text-foreground line-clamp-1">
							{user?.name || "User"}
						</p>
						<p className="text-xs text-muted-foreground opacity-70">
							{user?.email || "No email"}
						</p>
					</div>
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 ring-2 ring-primary/5">
						<Users className="h-5 w-5" />
					</div>
				</div>
			</div>
		</header>
	);
}
