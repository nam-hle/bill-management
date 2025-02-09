"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Stack, Alert, HStack, Heading } from "@chakra-ui/react";

import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { login, signup } from "@/app/login/actions";
import { PasswordInput } from "@/chakra/password-input";
import { type LoginFormPayload, LoginFormPayloadSchema } from "@/types";

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<LoginFormPayload>({
		resolver: zodResolver(LoginFormPayloadSchema)
	});

	const [formError, setFormError] = React.useState<string | undefined>();

	const onSubmitLogin = async (data: { email: string; password: string }) => {
		const error = await login(data);

		if (error) {
			setFormError(error);
		}
	};

	const onSubmitSignup = async (data: { email: string; password: string }) => {
		const error = await signup(data);

		if (error) {
			setFormError(error);
		}
	};

	return (
		<Stack gap="4" as="form" width="30%" marginInline="auto" onSubmit={handleSubmit((data) => onSubmitLogin(data))}>
			<Heading>Log in</Heading>

			{formError && (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Title>{formError}</Alert.Title>
				</Alert.Root>
			)}

			<Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
				<Input placeholder="Enter your full name" {...register("email")} />
			</Field>

			<Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
				<PasswordInput size="md" placeholder="Enter your password" {...register("password")} />
			</Field>

			<HStack justifyContent="space-between">
				<Button type="button" variant="subtle" loading={isSubmitting} onClick={handleSubmit(onSubmitSignup)}>
					Sign up
				</Button>
				<Button type="submit" loading={isSubmitting}>
					Log in
				</Button>
			</HStack>
		</Stack>
	);
};
