"use client";

import {
	CheckCircle2,
	LayoutDashboard,
	LogOut,
	SquareKanban,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Dashboard", href: "/", icon: LayoutDashboard },
	{ label: "Boards", href: "/boards", icon: SquareKanban },
	{ label: "Users", href: "/users", icon: Users },
];

export function Sidebar() {
	const { signOut } = useAuth();
	const activePath = usePathname();

	return (
		<aside className="w-64 shrink-0 bg-card border-r border-border flex flex-col p-6 transition-colors duration-300">
			<div className="flex items-center gap-3 mb-12">
				<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
					<CheckCircle2 className="h-6 w-6 font-bold" />
				</div>
				<span className="font-display font-bold text-xl tracking-tight text-foreground">
					TaskFlow
				</span>
			</div>

			<nav className="flex-1 space-y-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = activePath === item.href;
					return (
						<Link
							key={item.label}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
								isActive
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-muted",
							)}
						>
							<Icon className="h-5 w-5" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto pt-6 border-t border-border">
				<Button
					variant="ghost"
					onClick={() => signOut()}
					className="flex items-center justify-start gap-3 px-4 py-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors w-full h-auto"
				>
					<LogOut className="h-5 w-5" />
					<span className="font-medium text-base">Logout</span>
				</Button>
			</div>
		</aside>
	);
}
