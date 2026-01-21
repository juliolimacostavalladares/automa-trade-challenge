"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const signIn = async (email: string, password: string) => {
		setLoading(true);
		setError(null);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					router.push("/");
					router.refresh();
				},
				onError: (ctx) => {
					setLoading(false);
					setError(ctx.error.message);
				},
			},
		);
	};

	const signUp = async (name: string, email: string, password: string) => {
		setLoading(true);
		setError(null);

		await authClient.signUp.email(
			{
				email,
				password,
				name,
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onSuccess: () => {
					setLoading(false);
					router.push("/");
				},
				onError: (ctx) => {
					setLoading(false);
					setError(ctx.error.message);
				},
			},
		);
	};

	const signOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/sign-in");
					router.refresh();
				},
			},
		});
	};

	return {
		signIn,
		signUp,
		signOut,
		isLoading,
		error,
	};
}
