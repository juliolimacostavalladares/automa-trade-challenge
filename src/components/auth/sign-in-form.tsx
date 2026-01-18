"use client";

import { AtSign, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Auth } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { type SignInInput, signInSchema } from "@/schemas/auth.schema";

export default function SignInForm() {
	const { signIn, isLoading, error: authError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (data: SignInInput) => {
		signIn(data.email, data.password);
	};

	return (
		<div className="w-full">
			<div className="mb-10">
				<h2 className="text-3xl font-bold text-foreground mb-2">
					Welcome back!
				</h2>
				<p className="text-muted-foreground">
					Please enter your details to sign in.
				</p>
			</div>

			<Auth<SignInInput>
				schema={signInSchema}
				onSubmit={onSubmit}
				isLoading={isLoading}
				className="space-y-6"
			>
				<Auth.Input
					name="email"
					label="Email Address"
					type="email"
					placeholder="jessica@example.com"
					className="bg-muted/30 border-input rounded-xl focus-visible:ring-primary h-12"
					startIcon={<AtSign className="h-5 w-5 text-muted-foreground" />}
				/>

				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<Auth.Label htmlFor="password">Password</Auth.Label>
						<Link
							href="#"
							className="text-sm font-semibold text-primary hover:underline"
						>
							Forgot password?
						</Link>
					</div>
					<Auth.Input
						name="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						className="bg-muted/30 border-input rounded-xl focus-visible:ring-primary h-12"
						startIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
						endIcon={
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setShowPassword(!showPassword)}
								className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
								<span className="sr-only">Toggle password visibility</span>
							</Button>
						}
					/>
				</div>

				<div className="flex items-center space-x-2">
					<Checkbox
						id="rememberMe"
						className="rounded-sm border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
					/>
					<label
						htmlFor="rememberMe"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer"
					>
						Remember me for 30 days
					</label>
				</div>

				<Auth.Error error={authError} />

				<Auth.Submit className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 h-auto rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 transform active:scale-[0.98]">
					Sign In
				</Auth.Submit>
			</Auth>

			<div className="mt-8 pt-8 border-t border-border text-center">
				<p className="text-muted-foreground">
					Don't have an account?{" "}
					<Link
						href="/sign-up"
						className="text-primary font-bold hover:underline"
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
