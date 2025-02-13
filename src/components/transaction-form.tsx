"use client";

import { type z } from "zod";
import React, { useState } from "react";
import { parse, format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Stack, Group, Image, Input, HStack, Center, Heading, InputAddon } from "@chakra-ui/react";

import { API } from "@/api";
import { Field } from "@/chakra/field";
import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { axiosInstance } from "@/services";
import { Select } from "@/components/select";
import { DialogRoot, DialogContent } from "@/chakra/dialog";
import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
import { TransactionAction } from "@/components/transaction-action";
import { type ClientUser, type ClientTransaction } from "@/schemas";
import { TransactionStatusBadge } from "@/components/transaction-status-badge";
import { FormIssuedDateField, DateFieldTransformer, FormAmountFieldSchema } from "@/schemas/form.schema";

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
	amount: FormAmountFieldSchema,
	issuedAt: FormIssuedDateField
});

type FormState = z.infer<typeof FormStateSchema>;

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { kind, users, currentUserId } = props;
	const editing = React.useMemo(() => kind.type === "update", [kind.type]);
	const [qrImage, setQrImage] = React.useState<string | undefined>(undefined);

	const router = useRouter();
	const { mutate: generateQR } = useMutation({
		mutationFn: (payload: API.Transactions.Create.Body) =>
			axiosInstance.post("/qr", {
				amount: payload.amount,
				bankAccountId: payload.bankAccountId
			}),
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to generate QR code",
				description: "An error occurred while generating the QR code. Please try again."
			});
		},
		onSuccess: (response) => {
			toaster.create({
				type: "success",
				title: "QR code generated successfully",
				description: "A new QR code has been generated successfully."
			});

			setQrImage(response.data.qrCode);
			setOpenDialog(true);
		}
	});

	const { mutate } = useMutation({
		mutationFn: (payload: API.Transactions.Create.Body) => axiosInstance.post("/transactions", payload),
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to create transaction",
				description: "An error occurred while creating the transaction. Please try again."
			});
		},
		onSuccess: () => {
			toaster.create({
				type: "success",
				title: "Transaction created successfully",
				description: "A new transaction has been created and saved successfully. Redirecting to transactions page..."
			});

			router.push("/transactions");
		}
	});

	const {
		watch,
		reset,
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors }
	} = useForm<FormState>({
		resolver: zodResolver(FormStateSchema),
		defaultValues: {
			amount: kind.type === "update" ? String(kind.transaction.amount) : "",
			receiverId: kind.type === "update" ? kind.transaction.receiver.id : "",
			issuedAt: DateFieldTransformer.fromServer(kind.type === "update" ? kind.transaction.issuedAt : undefined)
		}
	});

	const { mutate: fetchSuggestion } = useMutation({
		mutationKey: ["transactions", "suggestion"],
		mutationFn: () => API.Transactions.Suggestion.query(),
		onSuccess: (data) => {
			const suggestion = data.suggestion;

			if (!suggestion) {
				return;
			}

			reset({
				amount: String(suggestion.amount),
				receiverId: suggestion.receiverId,
				bankAccountId: suggestion.bankAccountId
			});
		}
	});

	const receiverId: string | undefined = watch("receiverId");

	const { data: receiverBankAccounts, isPending: isFetchingReceiverBankAccounts } = useQuery({
		enabled: !!receiverId,
		queryKey: ["bank-accounts", "transaction-form", receiverId],
		queryFn: () => API.BankAccounts.List.query({ userId: receiverId })
	});

	const onGenerateQR = React.useMemo(
		() =>
			handleSubmit((data) => {
				generateQR({
					...data,
					amount: data.amount === "" ? 0 : Number(data.amount),
					issuedAt: DateFieldTransformer.toServer(data.issuedAt)
				});
			}),
		[generateQR, handleSubmit]
	);

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
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			{openDialog && qrImage && (
				<DialogRoot lazyMount open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
					<DialogContent margin={0} width="100vw" height="100vh" boxShadow="none" justifyContent="center" backgroundColor="transparent">
						<Center>
							<Image alt="receipt" src={qrImage} />
						</Center>
						<HStack marginTop="{spacing.4}" justifyContent="center">
							<Button variant="solid" onClick={onSubmit}>
								Done
							</Button>
						</HStack>
					</DialogContent>
				</DialogRoot>
			)}
			<Stack maxWidth="60%" gap="{spacing.4}">
				<HStack gap={0} justifyContent="space-between">
					<Heading>
						{editing ? "Transaction Details" : "New Transaction"}
						{kind.type === "update" && <TransactionStatusBadge size="sm" status={kind.transaction.status} />}
					</Heading>
					{kind.type === "update" && <TransactionAction currentUserId={currentUserId} transaction={kind.transaction} />}
				</HStack>

				<Field required label="Receiver" invalid={!!errors.receiverId} errorText={errors.receiverId?.message}>
					<Controller
						name="receiverId"
						control={control}
						render={({ field }) => (
							<Select
								{...register("receiverId")}
								readonly={editing}
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
						)}
					/>
				</Field>

				<Field required label="Bank Account" invalid={!!errors.bankAccountId} errorText={errors.bankAccountId?.message}>
					<Controller
						control={control}
						name="bankAccountId"
						render={({ field }) => (
							<Select
								readonly={editing}
								value={field.value}
								onValueChange={field.onChange}
								disabled={isFetchingReceiverBankAccounts}
								items={
									receiverBankAccounts?.flatMap((account) => {
										return { value: account.id, label: `${account.accountHolder} (${account.providerName} ${account.accountNumber})` };
									}) ?? []
								}
							/>
						)}
					/>
				</Field>

				<Field required label="Amount" invalid={!!errors.amount} errorText={errors.amount?.message}>
					<Group attached width="100%">
						<Input {...register("amount")} textAlign="right" readOnly={editing} pointerEvents={editing ? "none" : undefined} />
						<InputAddon>.000 VND</InputAddon>
					</Group>
				</Field>

				<Field required label="Issued At" invalid={!!errors.issuedAt} errorText={errors.issuedAt?.message}>
					<Input {...register("issuedAt")} readOnly={editing} placeholder={CLIENT_DATE_FORMAT} pointerEvents={editing ? "none" : undefined} />
				</Field>

				{kind.type === "create" && (
					<HStack>
						<Button variant="solid" onClick={onSubmit}>
							<IoIosAddCircle /> Create
						</Button>
						<Button variant="solid" onClick={onGenerateQR}>
							<IoIosAddCircle /> Generate QR
						</Button>
						<Button onClick={() => fetchSuggestion()}>Suggest</Button>
					</HStack>
				)}
			</Stack>
		</>
	);
};
