"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/shadcn/lib/utils";
import { signup } from "@/app/login/actions";
import { Input } from "@/shadcn/components/ui/input";
import { Button } from "@/shadcn/components/ui/button";
import { RequiredLabel } from "@/components/required-label";
import { type SignUpForm, SignUpFormSchema } from "@/schemas";
import { Alert, AlertDescription } from "@/shadcn/components/ui/alert";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/shadcn/components/ui/form";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/shadcn/components/ui/card";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const form = useForm<SignUpForm>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { email: "", password: "", fullName: "", confirmPassword: "" }
	});

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = form;

	const [signUpError, setSignUpError] = React.useState<string | undefined>();

	const onSubmitSignup = async (data: { email: string; password: string }) => {
		const error = await signup(data);

		if (error) {
			setSignUpError(error);
		}
	};

	return (
		<Form {...form}>
			<div className={cn("mx-auto flex flex-col gap-6 w-[400px]", className)} {...props}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Sign Up</CardTitle>
						<CardDescription>Create a new account to get started</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit((data) => onSubmitSignup(data))}>
							<div className="flex flex-col gap-6">
								{signUpError && (
									<Alert className="py-2" variant="destructive">
										<AlertDescription>{signUpError}</AlertDescription>
									</Alert>
								)}
								<FormField
									name="fullName"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel htmlFor="fullName">Display Name</RequiredLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage>{errors.fullName?.message}</FormMessage>
										</FormItem>
									)}
								/>
								<FormField
									name="email"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel htmlFor="email">Email</RequiredLabel>
											<FormControl>
												<Input placeholder="john.doe@example.com" {...field} />
											</FormControl>
											<FormMessage>{errors.email?.message}</FormMessage>
										</FormItem>
									)}
								/>
								<FormField
									name="password"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel htmlFor="password">Password</RequiredLabel>
											<FormControl>
												<Input id="password" type="password" {...field} />
											</FormControl>
											<FormMessage>{errors.password?.message}</FormMessage>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<RequiredLabel htmlFor="confirmPassword">Confirm Password</RequiredLabel>
											<FormControl>
												<Input type="password" id="confirm-password" {...field} />
											</FormControl>
											<FormMessage>{errors.confirmPassword?.message}</FormMessage>
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Create Account
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</Form>
	);
}
