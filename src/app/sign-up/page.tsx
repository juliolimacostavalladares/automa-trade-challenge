"use client";

import { CheckCircle2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { ErrorBoundary } from "@/components/hoc/error-boundary";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) return null;

	return (
		<ErrorBoundary>
			<div className="bg-background min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-300 font-display">
				<div className="max-w-6xl w-full grid md:grid-cols-2 bg-card rounded-3xl overflow-hidden shadow-2xl custom-shadow border border-border min-h-200">
					<div className="hidden md:flex flex-col justify-between p-12 bg-secondary/30 relative overflow-hidden">
						<div className="absolute top-[-10%] right-[-10%] w-64 h-64 border-4 border-primary/20 rounded-full"></div>
						<div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 border-4 border-primary/10 rounded-full"></div>

						<div className="relative z-10">
							<div className="flex items-center gap-2 mb-12">
								<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
									<CheckCircle2 className="text-primary-foreground h-6 w-6" />
								</div>
								<span className="text-2xl font-bold tracking-tight text-foreground">
									TaskFlow
								</span>
							</div>
							<h1 className="text-5xl font-extrabold leading-tight text-foreground">
								Organize your <br />
								<span className="text-primary italic">workflow</span> like{" "}
								<br />
								never before.
							</h1>
							<p className="mt-6 text-muted-foreground text-lg max-w-sm">
								Join over 10,000+ professionals managing their daily tasks with
								precision.
							</p>
						</div>

						<div className="relative z-10 mt-8 bg-background/40 backdrop-blur-md rounded-2xl p-6 border border-border shadow-xl">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
									<div>
										<div className="h-3 w-24 bg-muted rounded mb-1"></div>
										<div className="h-2 w-16 bg-muted/50 rounded"></div>
									</div>
								</div>
								<div className="text-primary">•••</div>
							</div>
							<div className="space-y-3">
								<div className="h-4 w-full bg-primary/20 rounded"></div>
								<div className="h-4 w-3/4 bg-primary/20 rounded"></div>
								<div className="flex items-center gap-2 mt-4">
									<div className="h-2 grow bg-muted rounded-full overflow-hidden">
										<div className="h-full bg-primary w-2/3"></div>
									</div>
									<span className="text-xs font-semibold text-primary">
										66%
									</span>
								</div>
							</div>
						</div>

						<div className="relative z-10 flex items-center gap-4 text-sm font-medium text-muted-foreground">
							<span>© 2026 TaskFlow Inc.</span>

							<span>•</span>

							<a className="hover:text-primary transition-colors" href="/">
								Privacy Policy
							</a>
						</div>
					</div>

					<div className="p-8 md:p-16 flex flex-col justify-center bg-background/50">
						<Suspense
							fallback={
								<div className="text-muted-foreground">
									Loading registration...
								</div>
							}
						>
							<SignUpForm />
						</Suspense>
					</div>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={toggleTheme}
					className="fixed bottom-6 right-6 h-14 w-14 bg-card text-foreground rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border border-border z-50"
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
