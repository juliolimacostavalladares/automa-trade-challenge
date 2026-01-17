"use client";

import { useRouter } from "next/navigation";
import { type ComponentType, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function withAuthGuard<T extends object>(
	WrappedComponent: ComponentType<T>,
) {
	return function WithAuthGuard(props: T) {
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
				<div className="flex h-screen items-center justify-center">
					Loading...
				</div>
			);
		}

		return <WrappedComponent {...props} />;
	};
}
