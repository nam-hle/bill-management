"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Table, Badge, HStack, VStack, Heading } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { EmptyState } from "@/components/ui/empty-state";
import { displayDate, displayDateAsTitle } from "@/utils";
import { type ClientTransaction, TransactionStatusEnumSchema } from "@/types";

namespace BillsTable {
	export interface Props {
		readonly title?: string;
		readonly fullSize: number;
		readonly showFilters?: boolean;
		readonly currentUserId: string;
		readonly showFullSize?: boolean;
		readonly showPagination?: boolean;
		readonly action?: React.ReactNode;
		readonly transactions: ClientTransaction[];
	}
}

export const TransactionsTable: React.FC<BillsTable.Props> = (props) => {
	const { title, action, fullSize, transactions, showFullSize, currentUserId } = props;
	const router = useRouter();
	const createConfirmHandler = React.useCallback(
		(transactionId: string) => {
			return async () => {
				fetch(`/api/transactions/${transactionId}/confirm`, { method: "PATCH" }).then((response) => {
					if (response.ok) {
						toaster.create({
							type: "success",
							title: "Transaction Confirmed",
							description: "The transaction has been confirmed successfully."
						});
						router.refresh();
					} else {
						toaster.create({
							type: "error",
							title: "Error",
							description: "An error occurred while confirming the transaction."
						});
					}
				});
			};
		},
		[router]
	);

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">
					{title ?? "Transactions"}
					{showFullSize ? ` (${fullSize})` : ""}
				</Heading>
				{action}
			</HStack>
			{transactions.length === 0 && <EmptyState width="100%" title="You have no transactions yet." />}

			{transactions.length > 0 && (
				<Table.Root size="md" interactive variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>ID</Table.ColumnHeader>
							<Table.ColumnHeader>Issued At</Table.ColumnHeader>
							<Table.ColumnHeader>Sender</Table.ColumnHeader>
							<Table.ColumnHeader>Receiver</Table.ColumnHeader>
							<Table.ColumnHeader>Amount</Table.ColumnHeader>
							<Table.ColumnHeader>Status</Table.ColumnHeader>
							<Table.ColumnHeader></Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{transactions.map((transaction) => (
							<Table.Row key={transaction.id}>
								<Table.Cell>{transaction.id.slice(0, 6)}</Table.Cell>
								<Table.Cell title={displayDateAsTitle(transaction.issuedAt)}>{displayDate(transaction.issuedAt)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.sender, currentUserId)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.receiver, currentUserId)}</Table.Cell>
								<Table.Cell>{transaction.amount}</Table.Cell>
								<Table.Cell>
									<Badge
										size="lg"
										colorPalette={
											transaction.status === TransactionStatusEnumSchema.enum.Waiting
												? undefined
												: transaction.status === TransactionStatusEnumSchema.enum.Confirmed
													? "green"
													: "red"
										}>
										{transaction.status}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									{transaction.status === TransactionStatusEnumSchema.enum.Waiting && (
										<Button variant="solid" onClick={createConfirmHandler(transaction.id)}>
											Confirm
										</Button>
									)}
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			)}
		</VStack>
	);
};

function formatUser(user: { id: string; fullName: string | null }, currentUserId: string): React.ReactNode {
	if (user.id === currentUserId) {
		return <strong>{user.fullName}</strong>;
	}

	return <>{user.fullName}</>;
}
