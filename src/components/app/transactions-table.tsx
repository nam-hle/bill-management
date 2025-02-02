"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";

import { type API } from "@/api";
import { axiosInstance } from "@/axios";
import { EmptyState } from "@/components/ui/empty-state";
import { displayDate, displayDateAsTitle } from "@/utils";
import { FilterButton } from "@/components/app/filter-button";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { TransactionAction } from "@/components/app/transaction-action";
import { type DataListResponse, type ClientTransaction } from "@/types";
import { TableBodySkeleton } from "@/components/app/table-body-skeleton";
import { TransactionStatusBadge } from "@/components/app/transaction-status-badge";
import { PaginationRoot, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from "@/components/ui/pagination";

namespace TransactionsTable {
	export interface Props {
		readonly title?: string;
		readonly showFilters?: boolean;
		readonly currentUserId: string;
		readonly action?: React.ReactNode;
		readonly mode: "basic" | "advance";
	}
}
export async function fetchTransactions(params: API.Transactions.List.SearchParams) {
	const { data } = await axiosInstance.get<DataListResponse<ClientTransaction>>("/transactions", { params });

	return data;
}

export const TransactionsTable: React.FC<TransactionsTable.Props> = (props) => {
	const { mode, title, action, currentUserId } = props;

	const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);

	const [filters, setFilters] = React.useState<"toMe" | "byMe" | undefined>(undefined);

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ["transactions", page, currentUserId, filters],
		queryFn: () =>
			fetchTransactions(filters === "toMe" ? { page, receiverId: currentUserId } : filters === "byMe" ? { page, senderId: currentUserId } : { page })
	});

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
		setPage(() => params.page);
	}, []);

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">
					{title ?? "Transactions"}
					{mode === "advance" && isSuccess ? ` (${data.fullSize})` : ""}
				</Heading>
				{action}
			</HStack>
			{mode === "advance" && (
				<HStack width="100%">
					<FilterButton {...createOwnerFilter("toMe")}>To Me</FilterButton>
					<FilterButton {...createOwnerFilter("byMe")}>By Me</FilterButton>
				</HStack>
			)}

			{/*{transactions.length === 0 && <EmptyState width="100%" title="You have no transactions yet." />}*/}

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
					{isLoading ? (
						<TableBodySkeleton numberOfCols={mode === "advance" ? 7 : 6} />
					) : !data?.data.length ? (
						<Table.Row width="100%">
							<Table.Cell colSpan={mode === "advance" ? 7 : 6}>
								<EmptyState title="You have no transactions yet." />
							</Table.Cell>
						</Table.Row>
					) : (
						data.data.map((transaction) => (
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
						))
					)}
				</Table.Body>
			</Table.Root>

			{mode === "advance" && DEFAULT_PAGE_SIZE < (data?.fullSize ?? 0) && (
				<HStack w="100%" justifyContent="flex-end">
					<PaginationRoot page={page} siblingCount={1} count={data?.fullSize ?? 0} onPageChange={onPageChange} pageSize={DEFAULT_PAGE_SIZE}>
						<PaginationPrevTrigger />
						<PaginationItems />
						<PaginationNextTrigger />
					</PaginationRoot>
				</HStack>
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
