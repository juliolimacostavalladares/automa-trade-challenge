"use client";

import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { SidebarView } from "./sidebar.view";

const navItems = [
	{ label: "Dashboard", href: "/", icon: LayoutDashboard },
	{ label: "Users", href: "/users", icon: Users },
];

export function Sidebar() {
	const { signOut } = useAuth();
	const pathname = usePathname();

	return (
		<SidebarView
			navItems={navItems}
			activePath={pathname}
			onLogout={() => signOut()}
		/>
	);
}
