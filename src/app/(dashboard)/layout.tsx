"use client";

import { LogOut, User } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { signOut } = useAuth();

	return (
		<AuthGuard>
			<div className="min-h-screen bg-background font-display flex flex-col">
				{/* Navbar */}
				<header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
					<div className="container mx-auto px-4 h-16 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-lg">
									t.
								</span>
							</div>
							<span className="text-xl font-bold text-foreground">
								TaskMaster
							</span>
						</div>

						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => signOut()}
								className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
							>
								<LogOut className="h-4 w-4" />
								<span>Sign Out</span>
							</Button>
							<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
								<User className="h-4 w-4" />
							</div>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
			</div>
		</AuthGuard>
	);
}
