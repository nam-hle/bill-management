"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input, Stack, HStack, Heading } from "@chakra-ui/react";

import { type UserFormState } from "@/types";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";

export const NewUserForm = () => {
	const [formState, setFormState] = React.useState<UserFormState>({
		username: ""
	});
	const router = useRouter();

	const onSave = React.useCallback(async () => {
		await fetch("/api/users", {
			method: "POST",
			body: JSON.stringify(formState),
			headers: { "Content-Type": "application/json" }
		}).then(() => {
			router.push("/users");

			toaster.create({
				type: "success",
				title: "User created",
				description: "User has been created successfully"
			});
		});
	}, [formState, router]);

	return (
		<Stack width="50%" gap="{spacing.4}" marginInline="auto">
			<Heading>New User</Heading>
			<Field required label="Username">
				<Input
					value={formState.username}
					placeholder="Enter username"
					onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
				/>
			</Field>

			<HStack justifyContent="flex-end">
				<Button variant="solid" onClick={onSave}>
					Save
				</Button>
			</HStack>
		</Stack>
	);
};
