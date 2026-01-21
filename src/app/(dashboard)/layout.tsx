"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<div className="flex h-screen overflow-hidden bg-background font-display transition-colors duration-300 text-foreground">
				<Sidebar />

				<main className="flex-1 flex flex-col overflow-hidden">
					<Header />

					<div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-12 custom-scrollbar">
						{children}
					</div>
				</main>
			</div>
		</AuthGuard>
	);
}
