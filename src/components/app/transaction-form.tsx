"use client";

import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { Stack, Group, Input, HStack, Heading, InputAddon } from "@chakra-ui/react";

import { SERVER_DATE_FORMAT } from "@/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/app/select";
import { toaster } from "@/components/ui/toaster";
import { type APIPayload, type ClientUser } from "@/types";

namespace TransactionForm {
	export interface Props {
		readonly users: readonly ClientUser[];
	}
}

export const TransactionForm: React.FC<TransactionForm.Props> = (props) => {
	const { users } = props;

	const [receiverId, setReceiverId] = React.useState<string | undefined>();
	const [amount, setAmount] = React.useState<string>("0");

	const router = useRouter();
	const onSubmit = React.useCallback(async () => {
		await fetch("/api/transactions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				receiverId: receiverId!,
				amount: parseInt(amount, 10),
				issuedAt: format(new Date(), SERVER_DATE_FORMAT)
			} satisfies APIPayload.Transaction.CreateTransactionRequestPayload)
		}).then((response) => {
			if (response.ok) {
				router.push("/transactions");

				toaster.create({
					type: "success",
					title: "Transaction created successfully",
					description: "A new transaction has been created and saved successfully."
				});
			} else {
				toaster.create({
					type: "error",
					title: "Failed to create transaction",
					description: "An error occurred while creating the transaction. Please try again."
				});
			}
		});
	}, [amount, receiverId, router]);

	return (
		<Stack gap="{spacing.4}">
			<Stack gap={0}>
				<Heading>New Transaction</Heading>
			</Stack>

			<Field required label="Receiver">
				<Select value={receiverId} onValueChange={setReceiverId} items={users.map((user) => ({ value: user.id, label: user.fullName }))} />
			</Field>
			<Field label="Amount">
				<Group attached width="100%">
					<Input value={amount} textAlign="right" onChange={(event) => setAmount(event.target.value)} />
					<InputAddon>.000 VND</InputAddon>
				</Group>
			</Field>

			<HStack>
				<Button variant="solid" onClick={onSubmit}>
					<IoIosAddCircle /> Create
				</Button>
			</HStack>
		</Stack>
	);
};
