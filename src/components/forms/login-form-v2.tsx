"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/shadcn/lib/utils";
import { login } from "@/app/login/actions";
import { Input } from "@/shadcn/components/ui/input";
import { Button } from "@/shadcn/components/ui/button";
import { type LoginFormPayload, LoginFormPayloadSchema } from "@/schemas";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/shadcn/components/ui/card";
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/shadcn/components/ui/form";

export function LoginFormV2({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const form = useForm<LoginFormPayload>({
		resolver: zodResolver(LoginFormPayloadSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = form;

	const [_formError, setFormError] = React.useState<string | undefined>();

	const onSubmitLogin = async (data: { email: string; password: string }) => {
		const error = await login(data);

		if (error) {
			setFormError(error);
		}
	};

	return (
		<Form {...form}>
			<div className={cn("flex flex-col gap-6 w-[400px]", className)} {...props}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>Enter your email below to login to your account</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmitLogin)}>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<FormField
										name="email"
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="Enter your full name" {...field} />
												</FormControl>
												<FormMessage>{errors.email?.message}</FormMessage>
											</FormItem>
										)}
									/>
								</div>
								<FormField
									name="password"
									control={control}
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center">
												<FormLabel>Password</FormLabel>
												<a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
													Forgot your password?
												</a>
											</div>
											<FormControl>
												<Input id="password" type="password" {...field} />
											</FormControl>
											<FormMessage>{errors.password?.message}</FormMessage>
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{" "}
								<a href="#" className="underline underline-offset-4">
									Sign up
								</a>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</Form>
	);
}
