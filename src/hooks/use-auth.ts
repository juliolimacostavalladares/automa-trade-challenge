"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
	const router = useRouter();
	const { isLoading, error, setLoading, setError } = useAuthStore();

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
					router.push("/"); // Redirect to dashboard
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
