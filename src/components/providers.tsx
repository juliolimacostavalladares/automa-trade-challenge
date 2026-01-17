"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import TRPCProvider from "@/trpc/Provider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<TRPCProvider>{children}</TRPCProvider>
		</NextThemesProvider>
	);
}
