"use client";

import React from "react";
import { Input, Stack, Alert, HStack, Heading } from "@chakra-ui/react";

import { renderError } from "@/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { login, signup } from "@/app/login/actions";
import { PasswordInput } from "@/components/ui/password-input";

export const LoginForm = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [validating, setValidating] = React.useState(false);
	const [formError, setFormError] = React.useState<string | undefined>();

	const missingFields = React.useMemo(() => {
		return email === "" || password === "";
	}, [email, password]);

	const emailError = React.useMemo(() => {
		if (email === "") {
			return "Email is required";
		}

		return undefined;
	}, [email]);

	const passwordError = React.useMemo(() => {
		if (password === "") {
			return "Password is required";
		}

		return undefined;
	}, [password]);

	const handleLogin = React.useCallback(async () => {
		if (missingFields) {
			setValidating(true);

			return;
		}

		await login({ email, password }).then(setFormError);
	}, [email, missingFields, password]);

	const handleSignup = React.useCallback(async () => {
		await signup({ email, password }).then(setFormError);
	}, [email, password]);

	return (
		<Stack width="30%" gap="{spacing.4}" marginInline="auto">
			<Heading>Log in</Heading>

			{formError && (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Title>{formError}</Alert.Title>
				</Alert.Root>
			)}
			<Field required label="Email" {...renderError(validating, emailError)}>
				<Input value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
			</Field>
			<Field required label="Password" {...renderError(validating, passwordError)}>
				<PasswordInput size="md" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
			</Field>
			<HStack justifyContent="space-between">
				<Button variant="subtle" onClick={handleSignup} disabled={missingFields}>
					Sign up
				</Button>
				<Button onClick={handleLogin} disabled={missingFields}>
					Log in
				</Button>
			</HStack>
		</Stack>
	);
};
