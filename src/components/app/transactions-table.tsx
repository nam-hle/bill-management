"use client";

import React from "react";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { type ClientTransaction } from "@/types";
import { formatTime, formatDistanceTime } from "@/utils";
import { EmptyState } from "@/components/ui/empty-state";

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
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{transactions.map((transaction) => (
							<>
								<Table.Cell>{transaction.id.slice(0, 6)}</Table.Cell>
								<Table.Cell title={formatTime(transaction.issuedAt)}>{formatDistanceTime(transaction.issuedAt)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.sender, currentUserId)}</Table.Cell>
								<Table.Cell>{formatUser(transaction.receiver, currentUserId)}</Table.Cell>
								<Table.Cell>{transaction.amount}</Table.Cell>
							</>
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
