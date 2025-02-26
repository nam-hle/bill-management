"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/shadcn/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { Heading } from "@/components/heading";
import { FileUpload } from "@/components/file-upload";
import { RequiredLabel } from "@/components/required-label";
import { LoadingButton } from "@/components/loading-button";

import { API } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { type ProfileFormPayload } from "@/schemas";
import { getAvatarFallback } from "@/utils/avatar-fallback";

namespace ProfileForm {
	export interface Props {
		readonly email: string;
		readonly userId: string;
		readonly fullName: string;
		readonly avatarUrl: string | null;
	}
}

export const ProfileForm: React.FC<ProfileForm.Props> = (props) => {
	const form = useForm<ProfileFormPayload & { email: string }>({
		defaultValues: { email: props.email, fullName: props.fullName, avatarUrl: props.avatarUrl }
	});
	const {
		reset,
		control,
		getValues,
		handleSubmit,
		formState: { isDirty, isSubmitting }
	} = form;

	const { toast } = useToast();
	const { mutate, isPending } = useMutation({
		mutationFn: API.Profile.Update.mutate,
		onSuccess: (data) => {
			reset(data);
			toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to update profile",
				description: "An error occurred while updating the profile. Please try again."
			});
		}
	});

	const onSubmit = React.useMemo(() => handleSubmit((data) => mutate(data)), [handleSubmit, mutate]);

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="mx-auto w-[60%] space-y-4">
				<Heading>Profile</Heading>
				<div className="grid grid-cols-12 grid-rows-2 gap-2">
					<div className="col-span-9">
						<FormField
							name="email"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel>Email</RequiredLabel>
									<FormControl>
										<Input {...field} disabled />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-3 row-span-2 flex items-center justify-center self-center">
						<FormField
							name="avatarUrl"
							control={control}
							render={({ field }) => (
								<FileUpload
									editing
									buttonSize="sm"
									bucketName="avatars"
									ownerId={props.userId}
									onChange={field.onChange}
									fileId={field.value ?? undefined}
									imageRenderer={(src) => (
										<Avatar className="h-20 w-20 cursor-pointer">
											<AvatarImage src={src} className="object-cover" />
											<AvatarFallback className="text-sm">{getAvatarFallback(getValues("fullName"))}</AvatarFallback>
										</Avatar>
									)}
								/>
							)}
						/>
					</div>

					<div className="col-span-9">
						<FormField
							name="fullName"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel>Full Name</RequiredLabel>
									<FormControl>
										<Input placeholder="Enter full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-start">
					<LoadingButton size="sm" type="submit" disabled={!isDirty} loadingText="Updating..." loading={isSubmitting || isPending}>
						Update
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
};
