"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { Card, CardTitle, CardHeader, CardFooter, CardContent, CardDescription } from "@/shadcn/components/ui/card";

export function SignUpForm() {
	const form = useForm<SignUpForm>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: { email: "", password: "", fullName: "", confirmPassword: "" }
	});

	const {
		control,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = form;

	const onSubmitSignup = async (data: { email: string; password: string }) => {
		const error = await signup(data);

		if (error) {
			setError("root", { message: error });
		}
	};

	return (
		<Form {...form}>
			<div className={cn("mx-auto flex flex-col gap-6 w-[400px]")}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Sign Up</CardTitle>
						<CardDescription>Create a new account to get started</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit((data) => onSubmitSignup(data))}>
						<CardContent>
							<div className="flex flex-col gap-6">
								{errors.root && (
									<Alert className="py-2" variant="destructive">
										<AlertDescription>{errors.root.message}</AlertDescription>
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
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting && <Loader2 className="animate-spin" />}
								Create Account
							</Button>
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<Link href="/login" className="text-primary underline underline-offset-4">
									Log in here
								</Link>
							</p>
						</CardFooter>
					</form>
				</Card>
			</div>
		</Form>
	);
}
