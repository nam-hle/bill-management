"use client";
import React from "react";
import { DevTool } from "@hookform/devtools";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Input, Stack, HStack, Heading } from "@chakra-ui/react";

import { axiosInstance } from "@/axios";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { type ProfileFormPayload } from "@/types";
import { toaster } from "@/components/ui/toaster";
import { ProfileAvatar } from "@/components/app/profile-avatar";

namespace ProfileForm {
	export interface Props {
		readonly email: string;
		readonly userId: string;
		readonly fullName: string;
		readonly avatarUrl: string | null;
	}
}

export const ProfileForm: React.FC<ProfileForm.Props> = (props) => {
	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting }
	} = useForm<ProfileFormPayload>({ defaultValues: { fullName: props.fullName, avatarUrl: props.avatarUrl } });

	const { mutate, isPending } = useMutation({
		mutationFn: async (payload: ProfileFormPayload) => {
			return axiosInstance.post("/profile", payload);
		},
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to update profile",
				description: "An error occurred while updating the profile. Please try again."
			});
		},
		onSuccess: (data) => {
			reset(data.data as unknown as ProfileFormPayload);
			toaster.create({ type: "success", title: "Profile updated", description: "Your profile has been updated successfully." });
		}
	});

	const onSubmit = React.useMemo(() => handleSubmit((data) => mutate(data)), [handleSubmit, mutate]);

	return (
		<Stack as="form" width="30%" gap="{spacing.4}" marginInline="auto" onSubmit={onSubmit}>
			<Heading>Account</Heading>
			<Controller
				name="avatarUrl"
				control={control}
				render={({ field }) => <ProfileAvatar size={150} userId={props.userId} url={field.value ?? undefined} onAvatarChange={field.onChange} />}
			/>
			<Field readOnly label="Email">
				<Input value={props.email} pointerEvents="none" />
			</Field>
			<Field label="Full Name*" invalid={!!errors.fullName} errorText={errors.fullName?.message}>
				<Input {...register("fullName", { required: "Full Name is required" })} placeholder="Enter your full name" />
			</Field>
			<HStack justifyContent="flex-end">
				<Button type="submit" disabled={!isDirty} loadingText="Saving..." loading={isSubmitting || isPending}>
					Save
				</Button>
			</HStack>
			<DevTool control={control} />
		</Stack>
	);
};
