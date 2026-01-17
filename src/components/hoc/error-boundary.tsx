"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
	children?: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
					<h2 className="text-2xl font-bold">Something went wrong</h2>
					<p className="text-gray-500">{this.state.error?.message}</p>
					<Button
						onClick={() => this.setState({ hasError: false })}
						variant="outline"
					>
						Try again
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}
