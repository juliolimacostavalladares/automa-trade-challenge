"use client";

import { Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

export function Header() {
	const { data: user } = trpc.getProfile.useQuery();

	return (
		<header className="h-20 flex items-center justify-end px-8 bg-transparent">
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-3">
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
