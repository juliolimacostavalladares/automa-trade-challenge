"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isAuthorized, setIsAuthorized] = useState(false);
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending) {
			if (!session) {
				router.replace("/sign-in");
			} else {
				setIsAuthorized(true);
			}
		}
	}, [session, isPending, router]);

	if (isPending || !isAuthorized) {
		return (
			<div className="flex h-screen items-center justify-center text-muted-foreground">
				Loading...
			</div>
		);
	}

	return <>{children}</>;
}
