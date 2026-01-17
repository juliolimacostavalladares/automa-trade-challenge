"use client";

import { AtSign, Eye, EyeOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Auth } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { type SignUpInput, signUpSchema } from "@/schemas/auth.schema";

export default function SignUpForm() {
	const { signUp, isLoading, error } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = (data: SignUpInput) => {
		signUp(data.name, data.email, data.password);
	};

	return (
		<div className="w-full">
			<div className="mb-10">
				<h2 className="text-3xl font-bold text-foreground mb-2">
					Create an account
				</h2>
				<p className="text-muted-foreground">
					Start your 14-day free trial today.
				</p>
			</div>

			<Auth<SignUpInput>
				schema={signUpSchema}
				onSubmit={onSubmit}
				isLoading={isLoading}
				className="space-y-6"
			>
				<Auth.Input
					name="name"
					label="Full Name"
					type="text"
					placeholder="Jessica Smith"
					className="bg-muted/30 border-input rounded-xl focus-visible:ring-primary h-12"
					startIcon={<User className="h-5 w-5 text-muted-foreground" />}
				/>

				<Auth.Input
					name="email"
					label="Email Address"
					type="email"
					placeholder="jessica@example.com"
					className="bg-muted/30 border-input rounded-xl focus-visible:ring-primary h-12"
					startIcon={<AtSign className="h-5 w-5 text-muted-foreground" />}
				/>

				<div className="space-y-2">
					<Auth.Label htmlFor="password">Password</Auth.Label>
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
						id="terms"
						className="rounded-sm border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
						required
					/>
					<label
						htmlFor="terms"
						className="text-sm text-muted-foreground leading-tight cursor-pointer"
					>
						I agree to the{" "}
						<Link
							href="#"
							className="text-primary font-semibold hover:underline"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="#"
							className="text-primary font-semibold hover:underline"
						>
							Privacy Policy
						</Link>
						.
					</label>
				</div>

				<Auth.Error error={error} />

				<Auth.Submit className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 h-auto rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 transform active:scale-[0.98]">
					Create Account
				</Auth.Submit>
			</Auth>

			<p className="mt-8 text-center text-muted-foreground font-medium">
				Already have an account?{" "}
				<Link
					href="/sign-in"
					className="text-primary font-bold hover:underline"
				>
					Sign In
				</Link>
			</p>
		</div>
	);
}
