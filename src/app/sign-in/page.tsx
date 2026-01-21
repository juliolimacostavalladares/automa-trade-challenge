"use client";

import { CheckCircle2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { ErrorBoundary } from "@/components/hoc/error-boundary";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) return null;

	return (
		<ErrorBoundary>
			<div className="bg-background min-h-screen flex items-center justify-center p-6 transition-colors duration-300 font-display">
				<div className="w-full max-w-5xl bg-card backdrop-blur-md rounded-3xl overflow-hidden flex flex-col md:flex-row custom-shadow border border-border">
					{/* Left Side - Hero/Branding */}
					<div className="hidden md:flex md:w-1/2 bg-secondary/50 p-12 flex-col justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
								<CheckCircle2 className="text-primary-foreground h-6 w-6" />
							</div>
							<span className="text-xl font-bold text-foreground">
								TaskFlow
							</span>
						</div>
						<div className="space-y-6">
							<h1 className="text-5xl font-bold leading-tight text-foreground">
								Manage your tasks <br />
								<span className="text-primary italic">more efficiently</span>{" "}
								than ever.
							</h1>
							<p className="text-muted-foreground text-lg text-balance">
								Join thousands of teams who simplify their workflow and boost
								productivity every single day.
							</p>
							<div className="flex -space-x-3 pt-4">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
									>
										<div className="w-full h-full bg-muted-foreground/20 animate-pulse" />
									</div>
								))}
								<div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
									+12k
								</div>
							</div>
						</div>
						<div className="text-muted-foreground/60 text-sm">
							© 2026 TaskFlow Inc. All rights reserved.
						</div>
					</div>

					{/* Right Side - Form */}
					<div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-background/50">
						<div className="mb-10 md:hidden flex items-center gap-3">
							<div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center transform rotate-12">
								<span className="text-background font-bold text-sm">t.</span>
							</div>
							<span className="text-lg font-bold text-foreground">
								TaskFlow
							</span>
						</div>

						<Suspense
							fallback={
								<div className="text-muted-foreground">Loading form...</div>
							}
						>
							<SignInForm />
						</Suspense>
					</div>
				</div>

				{/* Theme Toggle Button */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					className="fixed bottom-6 right-6 h-14 w-14 bg-card text-foreground rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border border-border"
					aria-label="Toggle theme"
				>
					{resolvedTheme === "dark" ? (
						<Sun className="h-6 w-6 text-primary" />
					) : (
						<Moon className="h-6 w-6" />
					)}
				</Button>
			</div>
		</ErrorBoundary>
	);
}
