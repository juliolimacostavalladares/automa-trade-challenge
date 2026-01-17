"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { createContext, forwardRef, useContext } from "react";
import {
	type DefaultValues,
	type FieldValues,
	FormProvider,
	type Resolver,
	type SubmitHandler,
	useForm,
	useFormContext,
} from "react-hook-form";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthFormContextValue {
	isLoading: boolean;
}
const AuthFormContext = createContext<AuthFormContextValue | undefined>(
	undefined,
);

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>;
	onSubmit: SubmitHandler<T>;
	defaultValues?: DefaultValues<T>;
	isLoading?: boolean;
	className?: string;
	children: React.ReactNode;
}

function AuthForm<T extends FieldValues>({
	schema,
	onSubmit,
	defaultValues,
	isLoading = false,
	className,
	children,
}: AuthFormProps<T>) {
	const methods = useForm<T>({
		resolver: zodResolver(schema as never) as Resolver<T>,
		defaultValues,
	});

	return (
		<AuthFormContext.Provider value={{ isLoading }}>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit as SubmitHandler<T>)}
					className={cn("space-y-4", className)}
				>
					{children}
				</form>
			</FormProvider>
		</AuthFormContext.Provider>
	);
}

const Field = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => <div className={cn("space-y-2", className)}>{children}</div>;

const FormLabel = ({
	htmlFor,
	children,
}: {
	htmlFor: string;
	children: React.ReactNode;
}) => <Label htmlFor={htmlFor}>{children}</Label>;

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ name, label, className, startIcon, endIcon, ...props }, ref) => {
		const {
			register,
			formState: { errors },
		} = useFormContext();
		const { isLoading } = useContext(AuthFormContext)!;

		const error = errors[name]?.message as string | undefined;

		const { ref: registerRef, ...registerProps } = register(name);

		return (
			<Field>
				{label && <FormLabel htmlFor={name}>{label}</FormLabel>}
				<Input
					id={name}
					disabled={isLoading}
					className={cn(
						error && "border-red-500 focus-visible:ring-red-500",
						className,
					)}
					startIcon={startIcon}
					endIcon={endIcon}
					{...registerProps}
					{...props}
					ref={(e) => {
						registerRef(e);
						if (typeof ref === "function") {
							ref(e);
						} else if (ref) {
							(ref as React.MutableRefObject<HTMLInputElement | null>).current =
								e;
						}
					}}
				/>
				{error && <p className="text-sm text-red-500">{error}</p>}
			</Field>
		);
	},
);
FormInput.displayName = "AuthForm.Input";

const Submit = ({
	children,
	className,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { isLoading } = useContext(AuthFormContext)!;
	return (
		<Button
			type="submit"
			disabled={isLoading}
			className={cn("w-full", className)}
			{...props}
		>
			{isLoading ? "Loading..." : children}
		</Button>
	);
};

const ErrorMessage = ({ error }: { error?: string | null }) => {
	if (!error) return null;
	return (
		<div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>
	);
};

export const Auth = Object.assign(AuthForm, {
	Field,
	Label: FormLabel,
	Input: FormInput,
	Submit,
	Error: ErrorMessage,
});
