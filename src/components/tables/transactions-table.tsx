"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";

import { FilterButton } from "@/components/filter-button";
import { DataTable } from "@/components/data-table/data-table";
import { TransactionAction } from "@/components/transaction-action";
import { TransactionStatusBadge } from "@/components/transaction-status-badge";

import { API } from "@/api";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { displayDate, displayDateAsTitle } from "@/utils";

namespace TransactionsTable {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const TransactionsTable: React.FC<TransactionsTable.Props> = (props) => {
	const { currentUserId } = props;

	const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);

	const [filters, setFilters] = React.useState<"toMe" | "byMe" | undefined>(undefined);

	const { data, isPending } = useQuery({
		queryKey: ["transactions", page, currentUserId, filters],
		queryFn: () =>
			API.Transactions.List.query(
				filters === "toMe" ? { page, receiverId: currentUserId } : filters === "byMe" ? { page, senderId: currentUserId } : { page }
			)
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

	return (
		<>
			{/*<HStack width="100%" data-testid="table-heading" justifyContent="space-between">*/}
			{/*	<TypographyH1 data-testid="table-title">*/}
			{/*		{title ?? "Transactions"}*/}
			{/*		{mode === "advance" && isSuccess ? ` (${data.fullSize})` : ""}*/}
			{/*	</TypographyH1>*/}
			{/*	{action}*/}
			{/*</HStack>*/}
			{/*{mode === "advance" && (*/}
			{/*	<HStack width="100%" data-testid="table-filters">*/}
			{/*		<FilterButton {...createOwnerFilter("toMe")}>To Me</FilterButton>*/}
			{/*		<FilterButton {...createOwnerFilter("byMe")}>By Me</FilterButton>*/}
			{/*	</HStack>*/}
			{/*)}*/}

			{/*{transactions.length === 0 && <EmptyState width="100%" title="You have no transactions yet." />}*/}
			<DataTable
				loading={isPending}
				title="Transactions"
				data={data?.data.map((row) => ({ ...row, href: `/transactions/${row.id}` }))}
				pagination={{ pageNumber: page, onPageChange: setPage, fullSize: data?.fullSize }}
				action={
					<Button asChild size="sm">
						<Link href="/transactions/new">
							<Plus /> New
						</Link>
					</Button>
				}
				toolbar={
					<div className="flex flex-1 items-center space-x-2">
						<FilterButton {...createOwnerFilter("toMe")}>To Me</FilterButton>
						<FilterButton {...createOwnerFilter("byMe")}>By Me</FilterButton>
					</div>
				}
				columns={[
					{
						key: "id",
						label: "ID",
						dataGetter: ({ row }) => row.id.slice(0, 6)
					},
					{
						key: "issuedAt",
						label: "Issued At",
						dataGetter: ({ row }) => displayDate(row.issuedAt),
						titleGetter: ({ row }) => displayDateAsTitle(row.issuedAt)
					},
					{
						key: "sender",
						label: "Sender",
						dataGetter: ({ row }) => formatUser(row.sender, currentUserId)
					},
					{
						key: "receiver",
						label: "Receiver",
						dataGetter: ({ row }) => formatUser(row.receiver, currentUserId)
					},
					{ key: "amount", label: "Amount", dataGetter: ({ row }) => row.amount },
					{
						key: "status",
						label: "Status",
						dataGetter: ({ row }) => <TransactionStatusBadge status={row.status} />
					},
					{ key: "action", label: "Action", dataGetter: ({ row }) => <TransactionAction transaction={row} currentUserId={currentUserId} /> }
				]}
			/>

			{/*{mode === "advance" && DEFAULT_PAGE_SIZE < (data?.fullSize ?? 0) && (*/}
			{/*	<HStack w="100%" justifyContent="flex-end">*/}
			{/*		<PaginationRoot page={page} siblingCount={1} count={data?.fullSize ?? 0} onPageChange={onPageChange} pageSize={DEFAULT_PAGE_SIZE}>*/}
			{/*			<PaginationPrevTrigger />*/}
			{/*			<PaginationItems />*/}
			{/*			<PaginationNextTrigger />*/}
			{/*		</PaginationRoot>*/}
			{/*	</HStack>*/}
			{/*)}*/}
		</>
	);
};

function formatUser(user: { id: string; fullName: string | null }, currentUserId: string): React.ReactNode {
	if (user.id === currentUserId) {
		return <strong>{user.fullName}</strong>;
	}

	return <>{user.fullName}</>;
}
