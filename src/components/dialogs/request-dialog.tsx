"use client";

import { z } from "zod";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "@/components/shadcn/dialog";

import { RequiredLabel } from "@/components/forms/required-label";

import { trpc } from "@/services";
import { useToast } from "@/hooks/use-toast";

const JoinGroupFormSchema = z.object({
	groupDisplayId: z.string().min(1, "Please enter a group ID")
});

export const RequestDialog = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { toast } = useToast();

	const form = useForm<z.infer<typeof JoinGroupFormSchema>>({
		defaultValues: { groupDisplayId: "" },
		resolver: zodResolver(JoinGroupFormSchema)
	});

	const utils = trpc.useUtils();

	const { control, setError, handleSubmit } = form;
	const mutation = trpc.groups.request.useMutation({
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to update profile",
				description: "An error occurred while updating the profile. Please try again."
			});
		},
		onSuccess: (data) => {
			if (data.ok) {
				toast({ title: "Request sent", description: "Your request to join the group has been sent successfully. Please wait for approval." });

				utils.users.requests.invalidate().then(() => setIsOpen(false));

				return;
			}

			setError("groupDisplayId", { message: data.error });
		}
	});

	const onSubmit = React.useMemo(() => handleSubmit((data) => mutation.mutate(data)), [handleSubmit, mutation]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Send className="h-4 w-4" />
					Request
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Join a Group</DialogTitle>
					<DialogDescription>Enter the group ID to send a join request.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<div className="grid gap-4 py-4">
							<div className="space-y-2">
								<FormField
									control={control}
									name="groupDisplayId"
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Group ID</RequiredLabel>
											<FormControl>
												<Input {...field} placeholder="Enter group ID" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type="submit">Send Request</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
