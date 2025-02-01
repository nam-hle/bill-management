"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Stack, Alert, HStack, Heading } from "@chakra-ui/react";

import { login } from "@/app/login/actions";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { type LoginFormPayload, LoginFormPayloadSchema } from "@/types";

export const LoginForm = () => {
	const { control, register, formState, handleSubmit } = useForm<LoginFormPayload>({
		resolver: zodResolver(LoginFormPayloadSchema)
	});
	const { errors, isDirty, isValid, isSubmitting } = formState;
	console.log(formState);
	const [formError, setFormError] = React.useState<string | undefined>();

	const onSubmitLogin = async (data: { email: string; password: string }) => {
		const error = await login(data);

		if (error) setFormError(error);
	};
	//
	// const onSubmitSignup = async (data: { email: string; password: string }) => {
	// 	const error = await signup(data);
	//
	// 	if (error) setFormError(error);
	// };

	const onSubmit = React.useMemo(() => handleSubmit((data) => onSubmitLogin(data)), [handleSubmit]);

	return (
		<Stack gap="4" as="form" width="30%" marginInline="auto" onSubmit={onSubmit}>
			<Heading>Log in</Heading>

			{formError && (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Title>{formError}</Alert.Title>
				</Alert.Root>
			)}

			<Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
				<Input {...register("email", { required: "Full Name is required" })} placeholder="Enter your full name" />
			</Field>

			<Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
				<PasswordInput size="md" placeholder="Enter your password" {...register("password", { required: true })} />
			</Field>

			<HStack justifyContent="space-between">
				{/*<Button type="button" variant="subtle" disabled={!isValid} loading={isSubmitting} onClick={handleSubmit(onSubmitSignup)}>*/}
				{/*	Sign up*/}
				{/*</Button>*/}
				<Button type="submit" disabled={!isValid} loading={isSubmitting}>
					Log in
				</Button>
			</HStack>
			<DevTool control={control} />
		</Stack>
	);
};
