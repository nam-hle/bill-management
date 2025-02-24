"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarImage } from "@/components/shadcn/avatar";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { FileUpload } from "@/components/file-upload";
import { TypographyH1 } from "@/components/typography";
import { RequiredLabel } from "@/components/required-label";

import { API } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { type ProfileFormPayload } from "@/schemas";

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
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting }
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
			<form onSubmit={onSubmit} className="mx-auto w-[60%] gap-4">
				<TypographyH1>Profile</TypographyH1>
				<div className="grid grid-cols-12 grid-rows-2 gap-2">
					<div className="col-span-3 row-span-2 self-center">
						<FormField
							name="avatarUrl"
							control={control}
							render={({ field }) => {
								return (
									<FileUpload
										editing
										buttonSize="sm"
										bucketName="avatars"
										ownerId={props.userId}
										onChange={field.onChange}
										fileId={field.value ?? undefined}
										imageRenderer={(src) => (
											<Avatar className="h-20 w-20 cursor-pointer">
												<AvatarImage src={src} />
												{/*<AvatarFallback className="text-sm">{getAvatarFallback(userInfo.fullName)}</AvatarFallback>*/}
											</Avatar>
										)}
									/>
								);
								// return <ProfileAvatar ownerId={props.userId} onChange={field.onChange} fileId={field.value ?? undefined} />;
							}}
						/>
					</div>

					<div className="col-span-9">
						<FormField
							name="email"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel htmlFor="email">Email</RequiredLabel>
									<FormControl>
										<Input {...field} disabled />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className="col-span-9">
						<FormField
							name="fullName"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel htmlFor="fullName">Full Name</RequiredLabel>
									<FormControl>
										<Input placeholder="Enter full name" {...field} />
									</FormControl>
									<FormMessage>{errors.fullName?.message}</FormMessage>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={!isDirty}
						// loading={isSubmitting || isPending}
					>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
};
