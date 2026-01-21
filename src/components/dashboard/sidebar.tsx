"use client";

import {
	CheckCircle2,
	LayoutDashboard,
	LogOut,
	Menu,
	SquareKanban,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Dashboard", href: "/", icon: LayoutDashboard },
	{ label: "Tasks", href: "/tasks", icon: SquareKanban },
	{ label: "Users", href: "/users", icon: Users },
];

export function Sidebar() {
	const { signOut } = useAuth();
	const activePath = usePathname();
	const [open, setOpen] = useState(false);

	const SidebarContent = () => (
		<div className="flex flex-col h-full p-6 bg-card transition-colors duration-300">
			<div className="flex items-center gap-3 mb-12">
				<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shrink-0">
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
							onClick={() => setOpen(false)}
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
		</div>
	);

	return (
		<>
			{/* Mobile Sidebar (Sheet-like using Dialog) */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" size="icon" className="h-10 w-10 bg-card">
							<Menu className="h-6 w-6" />
						</Button>
					</DialogTrigger>
					<DialogContent
						side="left"
						className="p-0 w-72 h-screen sm:max-w-72 border-r rounded-none"
					>
						<DialogHeader className="sr-only">
							<DialogTitle>Navigation Menu</DialogTitle>
							<DialogDescription>
								Navigate through TaskFlow dashboard.
							</DialogDescription>
						</DialogHeader>
						<SidebarContent />
					</DialogContent>
				</Dialog>
			</div>

			{/* Desktop Sidebar */}
			<aside className="hidden lg:flex w-64 shrink-0 border-r border-border flex-col sticky top-0 h-screen">
				<SidebarContent />
			</aside>
		</>
	);
}
