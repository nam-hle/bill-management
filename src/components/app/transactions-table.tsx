"use client";

import React from "react";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { EmptyState } from "@/components/ui/empty-state";
import { displayDate, displayDateAsTitle } from "@/utils";
import { FilterButton } from "@/components/app/filter-button";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { type Pagination, type ClientTransaction } from "@/types";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { TransactionAction } from "@/components/app/transaction-action";
import { TransactionStatusBadge } from "@/components/app/transaction-status-badge";
import { PaginationRoot, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from "@/components/ui/pagination";

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
	const { mode, title, action, currentUserId } = props;

	const [transactions, setTransactions] = React.useState<ClientTransaction[]>(() => props.transactions);
	const [fullSize, setFullSize] = React.useState<number>(() => props.fullSize);
	const [pagination, setPagination] = React.useState<Pagination>({ pageSize: DEFAULT_PAGE_SIZE, pageNumber: DEFAULT_PAGE_NUMBER });

	const [filters, setFilters] = React.useState<"toMe" | "byMe" | undefined>(undefined);

	const createOwnerFilter = React.useCallback(
		(filterKey: "toMe" | "byMe") => {
			return {
				active: filters === filterKey,
				onClick: () => setFilters((prev) => (prev === filterKey ? undefined : filterKey))
			};
		},
		[filters]
	);

	const onPageChange = React.useCallback((params: { page: number }) => {
		setPagination((prev) => ({ ...prev, pageNumber: params.page }));
	}, []);

	React.useEffect(() => {
		const searchParams = new URLSearchParams();

		if (filters === "toMe") {
			searchParams.append("receiverId", currentUserId);
		} else if (filters === "byMe") {
			searchParams.append("senderId", currentUserId);
		}

		searchParams.append("limit", pagination.pageSize.toString());
		searchParams.append("page", pagination.pageNumber.toString());

		fetch(`/api/transactions?${searchParams.toString()}`).then((response) => {
			if (response.ok) {
				response.json().then((result) => {
					const { fullSize, transactions } = result;
					setTransactions(transactions);
					setFullSize(fullSize);
				});
			}
		});
	}, [currentUserId, filters, pagination.pageNumber, pagination.pageSize]);

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">
					{title ?? "Transactions"}
					{mode === "advance" ? ` (${fullSize})` : ""}
				</Heading>
				{action}
			</HStack>
			{mode === "advance" && (
				<HStack width="100%">
					<FilterButton {...createOwnerFilter("toMe")}>To Me</FilterButton>
					<FilterButton {...createOwnerFilter("byMe")}>By Me</FilterButton>
				</HStack>
			)}

			{transactions.length === 0 && <EmptyState width="100%" title="You have no transactions yet." />}

			{transactions.length > 0 && (
				<>
					<Table.Root size="md" interactive variant="outline">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>ID</Table.ColumnHeader>
								<Table.ColumnHeader>Issued At</Table.ColumnHeader>
								<Table.ColumnHeader>Sender</Table.ColumnHeader>
								<Table.ColumnHeader>Receiver</Table.ColumnHeader>
								<Table.ColumnHeader>Amount</Table.ColumnHeader>
								<Table.ColumnHeader>Status</Table.ColumnHeader>
								{mode === "advance" && <Table.ColumnHeader></Table.ColumnHeader>}
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
									{mode === "advance" && (
										<Table.Cell>
											<TransactionAction transaction={transaction} currentUserId={currentUserId} />
										</Table.Cell>
									)}
								</LinkedTableRow>
							))}
						</Table.Body>
					</Table.Root>
					{mode === "advance" && pagination.pageSize < fullSize && (
						<HStack w="100%" justifyContent="flex-end">
							<PaginationRoot
								siblingCount={1}
								count={fullSize}
								onPageChange={onPageChange}
								page={pagination.pageNumber}
								pageSize={pagination.pageSize}>
								<PaginationPrevTrigger />
								<PaginationItems />
								<PaginationNextTrigger />
							</PaginationRoot>
						</HStack>
					)}
				</>
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
