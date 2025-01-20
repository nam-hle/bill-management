"use client";

import React from "react";
import { Input, Stack, HStack, Heading } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { login, signup } from "@/app/login/actions";
import { PasswordInput } from "@/components/ui/password-input";

export const LoginForm = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	return (
		<Stack width="30%" gap="{spacing.4}" marginInline="auto">
			<Heading>Log in</Heading>

			<Field required label="Email">
				<Input value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
			</Field>
			<Field required label="Password">
				<PasswordInput size="md" value={password} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
			</Field>
			<HStack justifyContent="space-between">
				<Button variant="subtle" onClick={() => signup({ email, password })}>
					Sign up
				</Button>
				<Button onClick={() => login({ email, password })}>Log in</Button>
			</HStack>
		</Stack>
	);
};
