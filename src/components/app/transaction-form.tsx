"use client";

import { z } from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { parse, format, isValid } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Group, Input, HStack, Heading, InputAddon } from "@chakra-ui/react";

import { API } from "@/api";
import { axiosInstance } from "@/axios";
import { type ClientUser } from "@/types";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { toaster } from "@/components/ui/toaster";
import { CLIENT_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/utils";
import { type ClientTransaction } from "@/schemas/transactions.schema";
import { TransactionAction } from "@/components/app/transaction-action";
import { TransactionStatusBadge } from "@/components/app/transaction-status-badge";

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
	amount: z
		.string()
		.refine((val) => val !== "", "Amount is required")
		.refine((val) => /^[1-9]\d*$/.test(val), "Amount must be a number greater than zero"),
	issuedAt: z
		.string()
		.min(1, "Issued date is required")
		.refine((val) => {
			try {
				return isValid(parse(val, CLIENT_DATE_FORMAT, new Date()));
			} catch {
				return false;
			}
		}, `Issued date must be a valid date and in ${CLIENT_DATE_FORMAT} format`)
});

type FormState = z.infer<typeof FormStateSchema>;

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { kind, users, currentUserId } = props;
	const editing = React.useMemo(() => kind.type === "update", [kind.type]);

	const router = useRouter();
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
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormState>({
		resolver: zodResolver(FormStateSchema),
		defaultValues: {
			amount: kind.type === "update" ? String(kind.transaction.amount) : "",
			receiverId: kind.type === "update" ? kind.transaction.receiver.id : "",
			issuedAt:
				kind.type === "update"
					? format(parse(kind.transaction.issuedAt, SERVER_DATE_FORMAT, new Date()), CLIENT_DATE_FORMAT)
					: format(new Date(), CLIENT_DATE_FORMAT)
		}
	});
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

	return (
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
							onValueChange={field.onChange}
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

			<Field required label="Issued At" invalid={!!errors.issuedAt} errorText={errors.issuedAt?.message}>
				<Input {...register("issuedAt")} readOnly={editing} placeholder={CLIENT_DATE_FORMAT} pointerEvents={editing ? "none" : undefined} />
			</Field>

			<Field required label="Amount" invalid={!!errors.amount} errorText={errors.amount?.message}>
				<Group attached width="100%">
					<Input {...register("amount")} textAlign="right" readOnly={editing} pointerEvents={editing ? "none" : undefined} />
					<InputAddon>.000 VND</InputAddon>
				</Group>
			</Field>

			{kind.type === "create" && (
				<HStack>
					<Button variant="solid" onClick={onSubmit}>
						<IoIosAddCircle /> Create
					</Button>
				</HStack>
			)}
		</Stack>
	);
};
