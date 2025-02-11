"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Input, Stack, HStack, Heading, GridItem, SimpleGrid } from "@chakra-ui/react";

import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { axiosInstance } from "@/services/axios";
import { type ProfileFormPayload } from "@/schemas";
import { ProfileAvatar } from "@/components/profile-avatar";

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
		<Stack as="form" width="60%" gap="{spacing.4}" onSubmit={onSubmit} marginInline="auto">
			<Heading>Profile</Heading>
			<SimpleGrid gap="{spacing.2}" templateRows="repeat(2, 1fr)" templateColumns="repeat(12, 1fr)">
				<GridItem rowSpan={2} colSpan={3} alignSelf="center">
					<Controller
						name="avatarUrl"
						control={control}
						render={({ field }) => <ProfileAvatar size={200} userId={props.userId} url={field.value ?? undefined} onAvatarChange={field.onChange} />}
					/>
				</GridItem>

				<GridItem colSpan={9}>
					<Field readOnly label="Email">
						<Input value={props.email} pointerEvents="none" />
					</Field>
				</GridItem>
				<GridItem colSpan={9}>
					<Field label="Full Name*" invalid={!!errors.fullName} errorText={errors.fullName?.message}>
						<Input {...register("fullName", { required: "Full Name is required" })} placeholder="Enter your full name" />
					</Field>
				</GridItem>
			</SimpleGrid>

			<HStack justifyContent="flex-end">
				<Button type="submit" disabled={!isDirty} loadingText="Saving..." loading={isSubmitting || isPending}>
					Save
				</Button>
			</HStack>
		</Stack>
	);
};
