"use client";

import React from "react";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { type ClientTransaction } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { displayDate, displayDateAsTitle } from "@/utils";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { TransactionAction } from "@/components/app/transaction-action";
import { TransactionStatusBadge } from "@/components/app/transaction-status-badge";

namespace TransactionsTable {
	export interface Props {
		readonly title?: string;
		readonly fullSize: number;
		readonly showFilters?: boolean;
		readonly currentUserId: string;
		readonly action?: React.ReactNode;
		readonly mode: "basic" | "advance";
		readonly transactions: ClientTransaction[];
	}
}

export const TransactionsTable: React.FC<TransactionsTable.Props> = (props) => {
	const { mode, title, action, fullSize, transactions, currentUserId } = props;

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">
					{title ?? "Transactions"}
					{mode === "advance" ? ` (${fullSize})` : ""}
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
							<LinkedTableRow key={transaction.id} href={`/transactions/${transaction.id}`}>
								<Table.Cell>{transaction.id.slice(0, 6)}</Table.Cell>
								<Table.Cell title={displayDateAsTitle(transaction.issuedAt)}>{displayDate(transaction.issuedAt)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.sender, currentUserId)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.receiver, currentUserId)}</Table.Cell>
								<Table.Cell>{transaction.amount}</Table.Cell>
								<Table.Cell>
									<TransactionStatusBadge status={transaction.status} />
								</Table.Cell>
								<Table.Cell>
									<TransactionAction transaction={transaction} currentUserId={currentUserId} />
								</Table.Cell>
							</LinkedTableRow>
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
