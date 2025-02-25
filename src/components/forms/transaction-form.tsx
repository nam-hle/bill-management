"use client";

import React from "react";
import { type z } from "zod";
import { Plus } from "lucide-react";
import { parse, format } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Form, FormItem, FormField, FormMessage, FormControl } from "@/components/shadcn/form";

import { Select } from "@/components/inputs";
import { Heading } from "@/components/heading";
import { RequiredLabel } from "@/components/required-label";
import { TransactionAction } from "@/components/transaction-action";
import { TransactionStatusBadge } from "@/components/transaction-status-badge";

import { API } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
import { type ClientUser, type ClientTransaction } from "@/schemas";
import { IssuedAtField, IssuedAtFieldTransformer, RequiredAmountFieldSchema } from "@/schemas/form.schema";

namespace TransactionForm {
	export interface Props {
		readonly currentUserId: string;
		readonly users: readonly ClientUser[];
		readonly kind:
			| {
					readonly type: "create";
			  }
			| {
					readonly type: "update";
					readonly transaction: ClientTransaction;
			  };
	}
}

const FormStateSchema = API.Transactions.Create.BodySchema.omit({ amount: true, issuedAt: true }).extend({
	issuedAt: IssuedAtField,
	amount: RequiredAmountFieldSchema("Amount is required")
});

type FormState = z.infer<typeof FormStateSchema>;

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { kind, users, currentUserId } = props;
	const editing = React.useMemo(() => kind.type === "create", [kind.type]);
	// const [_qrImage, setQrImage] = React.useState<string | undefined>(undefined);

	const { toast } = useToast();
	const router = useRouter();
	// const { mutate: generateQR } = useMutation({
	// 	mutationFn: API.QR.Create.mutate,
	// 	onError: () => {
	// 		toast({
	// 			variant: "destructive",
	// 			title: "Failed to generate QR code",
	// 			description: "An error occurred while generating the QR code. Please try again."
	// 		});
	// 	},
	// 	onSuccess: (response) => {
	// 		toast({
	// 			title: "QR code generated successfully",
	// 			description: "A new QR code has been generated successfully."
	// 		});
	//
	// 		setQrImage(response.url);
	// 		// setOpenDialog(true);
	// 	}
	// });

	const { mutate } = useMutation({
		mutationFn: API.Transactions.Create.mutation,
		onError: () => {
			toast({
				variant: "destructive",
				title: "Failed to create transaction",
				description: "An error occurred while creating the transaction. Please try again."
			});
		},
		onSuccess: () => {
			toast({
				title: "Transaction created successfully",
				description: "A new transaction has been created and saved successfully. Redirecting to transactions page..."
			});

			router.push("/transactions");
		}
	});

	const form = useForm<FormState>({
		resolver: zodResolver(FormStateSchema),
		defaultValues: {
			amount: kind.type === "update" ? String(kind.transaction.amount) : "",
			receiverId: kind.type === "update" ? kind.transaction.receiver.id : "",
			issuedAt: IssuedAtFieldTransformer.fromServer(kind.type === "update" ? kind.transaction.issuedAt : undefined)
		}
	});
	const {
		// watch,
		// reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors }
	} = form;

	// const { mutate: fetchSuggestion } = useMutation({
	// 	mutationKey: ["transactions", "suggestion"],
	// 	mutationFn: () => API.Transactions.Suggestion.query(),
	// 	onSuccess: (data) => {
	// 		const suggestion = data.suggestion;
	//
	// 		if (!suggestion) {
	// 			return;
	// 		}
	//
	// 		reset({
	// 			amount: String(suggestion.amount),
	// 			receiverId: suggestion.receiverId,
	// 			bankAccountId: suggestion.bankAccountId
	// 		});
	// 	}
	// });

	// const receiverId: string | undefined = watch("receiverId");

	// const { data: receiverBankAccounts, isPending: isFetchingReceiverBankAccounts } = useQuery({
	// 	enabled: !!receiverId,
	// 	queryKey: ["bank-accounts", "transaction-form", receiverId],
	// 	queryFn: () => API.BankAccounts.List.query({ userId: receiverId })
	// });

	// const onGenerateQR = React.useMemo(
	// 	() =>
	// 		handleSubmit((data) => {
	// 			generateQR({
	// 				...data,
	// 				bankAccountId: data.bankAccountId ?? "",
	// 				amount: data.amount === "" ? 0 : Number(data.amount)
	// 			});
	// 		}),
	// 	[generateQR, handleSubmit]
	// );

	const onSubmit = React.useMemo(
		() =>
			handleSubmit((data) => {
				mutate({
					...data,
					amount: data.amount === "" ? 0 : Number(data.amount),
					issuedAt: format(parse(data.issuedAt, CLIENT_DATE_FORMAT, new Date()), SERVER_DATE_FORMAT)
				});
			}),
		[handleSubmit, mutate]
	);
	// const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			{/*{openDialog && qrImage && (*/}
			{/*	<DialogRoot lazyMount open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>*/}
			{/*		<DialogContent margin={0} width="100vw" height="100vh" boxShadow="none" justifyContent="center" backgroundColor="transparent">*/}
			{/*			<Center>*/}
			{/*				<Image alt="receipt" src={qrImage} />*/}
			{/*			</Center>*/}
			{/*			<HStack marginTop="{spacing.4}" justifyContent="center">*/}
			{/*				<Button onClick={onSubmit}>Done</Button>*/}
			{/*			</HStack>*/}
			{/*		</DialogContent>*/}
			{/*	</DialogRoot>*/}
			{/*)}*/}
			<Form {...form}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-row justify-between align-middle">
						<Heading className="flex align-middle">
							{editing ? "Transaction Details" : "New Transaction"}
							{kind.type === "update" && <TransactionStatusBadge className="ml-2" status={kind.transaction.status} />}
						</Heading>

						{kind.type === "update" && <TransactionAction currentUserId={currentUserId} transaction={kind.transaction} />}
					</div>

					<FormField
						control={control}
						name="receiverId"
						render={({ field }) => (
							<FormItem>
								<RequiredLabel htmlFor="receiverId">Receiver</RequiredLabel>
								<Select
									{...register("receiverId")}
									readonly={!editing}
									value={field.value}
									onValueChange={(value) => {
										field.onChange(value);
										setValue("bankAccountId", undefined);
									}}
									items={users.flatMap((user) => {
										if (editing || user.id !== currentUserId) {
											return { value: user.id, label: user.fullName };
										}

										return [];
									})}
								/>
								<FormMessage>{errors.receiverId?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/*<FormField*/}
					{/*	control={control}*/}
					{/*	name="bankAccountId"*/}
					{/*	render={({ field }) => (*/}
					{/*		<FormItem>*/}
					{/*			<RequiredLabel htmlFor="bankAccountId">Bank Account</RequiredLabel>*/}
					{/*			<SkeletonWrapper loading={isFetchingReceiverBankAccounts} skeleton={<Skeleton className="h-10 w-full" />}>*/}
					{/*				<Select*/}
					{/*					{...register("bankAccountId")}*/}
					{/*					readonly={editing}*/}
					{/*					value={field.value}*/}
					{/*					onValueChange={field.onChange}*/}
					{/*					items={*/}
					{/*						receiverBankAccounts?.flatMap((account) => {*/}
					{/*							return { value: account.id, label: `${account.accountHolder} (${account.providerName} ${account.accountNumber})` };*/}
					{/*						}) ?? []*/}
					{/*					}*/}
					{/*				/>*/}
					{/*			</SkeletonWrapper>*/}
					{/*			<FormMessage>{errors.bankAccountId?.message}</FormMessage>*/}
					{/*		</FormItem>*/}
					{/*	)}*/}
					{/*/>*/}

					<FormField
						name="amount"
						control={control}
						render={({ field }) => (
							<FormItem>
								<RequiredLabel htmlFor="amount">Amount</RequiredLabel>
								<FormControl>
									<Input {...field} readOnly={!editing} className={editing ? "" : "pointer-events-none"} />
								</FormControl>
								<FormMessage>{errors?.amount?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<FormField
						name="issuedAt"
						control={control}
						render={({ field }) => (
							<FormItem>
								<RequiredLabel htmlFor="issuedAt">Issued At</RequiredLabel>
								<FormControl>
									<Input placeholder={CLIENT_DATE_FORMAT} {...field} className={editing ? "" : "pointer-events-none"} />
								</FormControl>
								<FormMessage>{errors.issuedAt?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{kind.type === "create" && (
						<div className="flex justify-between gap-2">
							<Button onClick={onSubmit}>
								<Plus /> Create
							</Button>
							{/*<div className="flex gap-2">*/}
							{/*	<Button variant="secondary" onClick={onGenerateQR}>*/}
							{/*		Generate QR*/}
							{/*	</Button>*/}

							{/*	<Button variant="secondary" onClick={() => fetchSuggestion()}>*/}
							{/*		Suggest*/}
							{/*	</Button>*/}
							{/*</div>*/}
						</div>
					)}
				</div>
			</Form>
		</>
	);
};
