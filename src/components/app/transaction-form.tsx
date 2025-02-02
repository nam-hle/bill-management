"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { Stack, Group, Input, HStack, Heading, InputAddon } from "@chakra-ui/react";

import { type API } from "@/api";
import { axiosInstance } from "@/axios";
import { SERVER_DATE_FORMAT } from "@/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { toaster } from "@/components/ui/toaster";
import { type ClientUser, type ClientTransaction } from "@/types";
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

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { kind, users, currentUserId } = props;

	const [receiverId, setReceiverId] = React.useState<string | undefined>(() => (kind.type === "update" ? kind.transaction.receiver.id : undefined));
	const [amount, setAmount] = React.useState<string>(() => (kind.type === "update" ? kind.transaction.amount.toString() : ""));

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: (payload: API.Transactions.Create.Body) => axiosInstance.post("/transactions", payload),
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to create transaction",
				description: "An error occurred while creating the transaction. Please try again."
			});
		},
		onSuccess: () => {
			router.push("/transactions");

			toaster.create({
				type: "success",
				title: "Transaction created successfully",
				description: "A new transaction has been created and saved successfully."
			});
		}
	});

	return (
		<Stack gap="{spacing.4}">
			<HStack gap={0} justifyContent="space-between">
				<Heading>
					{kind.type === "create" ? "New Transaction" : "Transaction Details"}{" "}
					{kind.type === "update" && <TransactionStatusBadge size="sm" status={kind.transaction.status} />}
				</Heading>
				{kind.type === "update" && <TransactionAction currentUserId={currentUserId} transaction={kind.transaction} />}
			</HStack>

			<Field required label="Receiver">
				<Select
					value={receiverId}
					onValueChange={setReceiverId}
					readonly={kind.type === "update"}
					items={users.flatMap((user) => {
						if (kind.type === "update") {
							return { value: user.id, label: user.fullName };
						}

						if (kind.type === "create") {
							if (user.id !== currentUserId) {
								return { value: user.id, label: user.fullName };
							}

							return [];
						}

						throw new Error("Invalid kind type");
					})}
				/>
			</Field>
			<Field label="Amount">
				<Group attached width="100%">
					<Input value={amount} textAlign="right" readOnly={kind.type === "update"} onChange={(event) => setAmount(event.target.value)} />
					<InputAddon>.000 VND</InputAddon>
				</Group>
			</Field>

			{kind.type === "create" && (
				<HStack>
					<Button
						variant="solid"
						onClick={() =>
							mutation.mutate({
								receiverId: receiverId!,
								amount: parseInt(amount, 10),
								issuedAt: format(new Date(), SERVER_DATE_FORMAT)
							})
						}>
						<IoIosAddCircle /> Create
					</Button>
				</HStack>
			)}
		</Stack>
	);
};
