"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/shadcn/card";
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { trpc } from "@/services";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
	providerNumber: z.string().min(1, "Please select a bank"),
	accountName: z.string().min(2, "Account holder name is required"),
	accountNumber: z.string().min(6, "Account number must be at least 6 digits")
});

type BankAccountFormValues = z.infer<typeof formSchema>;

export const BankAccountForm = () => {
	const form = useForm<BankAccountFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accountName: "",
			accountNumber: "",
			providerNumber: ""
		}
	});
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = form;

	const { data: banks = [] } = trpc.banks.get.useQuery();

	const { toast } = useToast();
	const { mutate } = trpc.profile.createBankAccount.useMutation({
		onSuccess: () => {
			toast({ title: "Bank account added" });
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to add bank account"
			});
		}
	});

	const onSubmit = React.useMemo(
		() =>
			handleSubmit((data) => {
				mutate({
					type: "Bank",
					status: "Active",
					isDefault: false,
					accountHolder: data.accountName,
					accountNumber: data.accountNumber,
					providerNumber: data.providerNumber
				});
			}),
		[handleSubmit, mutate]
	);

	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<CardTitle>Link Bank Account</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-4">
						<FormField
							control={control}
							name="providerNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Bank</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger>
											<SelectValue placeholder="Choose a bank" />
										</SelectTrigger>
										<SelectContent>
											{banks.map(({ providerName, providerNumber }) => (
												<SelectItem key={providerNumber} value={providerNumber}>
													{providerName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage>{errors.providerNumber?.message}</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="accountNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Account Number</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Enter account number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="accountName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Account Holder Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Account name" {...field} />
									</FormControl>
									<FormMessage>{errors.accountName?.message}</FormMessage>
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Link Account
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
