"use client";

import _ from "lodash";
import React from "react";
import { GoSearch } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Text, Table, Input, HStack, VStack, Heading } from "@chakra-ui/react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { API } from "@/api";
import { InputGroup } from "@/chakra/input-group";
import { EmptyState } from "@/chakra/empty-state";
import { formatTime, formatDistanceTime } from "@/utils";
import { FilterButton } from "@/components/filter-button";
import { LinkedTableRow } from "@/components/table-body-row";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { TableBodySkeleton } from "@/components/table-body-skeleton";
import { PaginationRoot, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from "@/chakra/pagination";

namespace BillsTable {
	export interface Props {
		readonly title?: string;
		readonly advanced?: boolean;
		readonly currentUserId: string;
		readonly action?: React.ReactNode;
	}
}

type Filters = API.Bills.List.SearchParams;

function toFilters(searchParams: ReadonlyURLSearchParams): Filters {
	return API.Bills.List.SearchParamsSchema.parse(Object.fromEntries(searchParams.entries()));
}

function toSearchParams(filters: Filters) {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(filters)) {
		if (key === "page" && value === DEFAULT_PAGE_NUMBER) {
			continue;
		}

		if (value !== null && value !== undefined && value !== "") {
			params.set(key, value.toString());
		}
	}

	return `?${params.toString()}`;
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { title, action, advanced, currentUserId } = props;
	const searchParams = useSearchParams();
	const [filters, setFilters] = React.useState(() => toFilters(searchParams));

	const router = useRouter();

	const onFilterChange = React.useCallback(
		<T extends keyof Filters>(filterKey: T, filterValue: Filters[T]) => {
			setFilters((prevFilters) => {
				const nextFilters: Filters = {
					...prevFilters,
					[filterKey]: filterValue,
					page: filterKey === "page" ? (filterValue as number) : DEFAULT_PAGE_NUMBER
				};
				router.push(toSearchParams(nextFilters));

				return nextFilters;
			});
		},
		[router]
	);

	const createOwnerFilter = React.useCallback(
		(filterKey: "creditor" | "debtor" | "creator") => {
			return {
				active: filters[filterKey] === "me",
				onClick: () => onFilterChange(filterKey, filters[filterKey] === undefined ? "me" : undefined)
			};
		},
		[filters, onFilterChange]
	);

	const createTimeFilter = React.useCallback(
		(duration: "7d" | "30d" | undefined) => {
			return {
				active: filters["since"] === duration,
				onClick: () => onFilterChange("since", filters["since"] !== duration ? duration : undefined)
			};
		},
		[filters, onFilterChange]
	);

	const query = useDebounce({ ...filters, q: filters.q || undefined }, 500);
	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["bills", query],
		queryFn: () => API.Bills.List.query(query)
	});

	return (
		<VStack width="100%" gap="{spacing.4}" data-testid="table-container">
			<HStack width="100%" data-testid="table-heading" justifyContent="space-between">
				<Heading as="h1" data-testid="table-title">
					{title ?? "Bills"}
					{advanced && isSuccess ? ` (${data.fullSize})` : ""}
				</Heading>
				{action}
			</HStack>
			{advanced && (
				<HStack width="100%" data-testid="table-filters">
					<FilterButton {...createOwnerFilter("creator")}>As creator</FilterButton>
					<FilterButton {...createOwnerFilter("creditor")}>As creditor</FilterButton>
					<FilterButton {...createOwnerFilter("debtor")}>As debtor</FilterButton>
					<FilterButton {...createTimeFilter("7d")}>Last 7 days</FilterButton>
					<FilterButton {...createTimeFilter("30d")}>Last 30 days</FilterButton>
					<InputGroup w="200px" marginLeft="auto" startElement={<GoSearch />}>
						<Input name="search-bar" value={filters.q || ""} placeholder="Type to search.." onChange={(e) => onFilterChange("q", e.target.value)} />
					</InputGroup>
				</HStack>
			)}

			<Table.Root size="md" interactive variant="outline" data-testid={`table__${isPending ? "loading" : "settled"}`}>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Created</Table.ColumnHeader>
						<Table.ColumnHeader title="The one who made the payment for the bill">Creditor</Table.ColumnHeader>
						<Table.ColumnHeader maxW="400px" title="The ones who need to pay back the creditor">
							Debtors
						</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{isPending ? (
						<TableBodySkeleton numberOfCols={4} />
					) : !data?.data.length ? (
						<Table.Row width="100%">
							<Table.Cell colSpan={4}>
								<EmptyState title="You have no bills yet" />
							</Table.Cell>
						</Table.Row>
					) : (
						data.data?.map((bill) => (
							<LinkedTableRow key={bill.id} href={`/bills/${bill.id}`}>
								<Table.Cell>{bill.description}</Table.Cell>
								<Table.Cell title={formatTime(bill.creator.timestamp)}>{formatDistanceTime(bill.creator.timestamp)}</Table.Cell>
								<Table.Cell>{formatUserAmount(bill.creditor, currentUserId)}</Table.Cell>
								<Table.Cell maxW="400px">
									<Text truncate>
										{_.sortBy(bill.debtors, [(debtor) => debtor.userId !== currentUserId, (billMember) => billMember.userId]).map(
											(billMember, billMemberIndex) => (
												<React.Fragment key={billMember.userId}>
													{formatUserAmount(billMember, currentUserId)}
													{billMemberIndex !== bill.debtors.length - 1 ? ", " : ""}
												</React.Fragment>
											)
										)}
									</Text>
								</Table.Cell>
							</LinkedTableRow>
						))
					)}
				</Table.Body>
			</Table.Root>
			{advanced && isSuccess && DEFAULT_PAGE_SIZE < data.fullSize && (
				<HStack w="100%" justifyContent="flex-end">
					<PaginationRoot
						siblingCount={1}
						page={filters.page}
						count={data.fullSize}
						pageSize={DEFAULT_PAGE_SIZE}
						onPageChange={({ page }) => onFilterChange("page", page)}>
						<PaginationPrevTrigger />
						<PaginationItems />
						<PaginationNextTrigger />
					</PaginationRoot>
				</HStack>
			)}
		</VStack>
	);
};

function formatUserAmount(user: { userId: string; amount?: number; fullName: string | null }, currentUserId: string): React.ReactNode {
	const content = user.amount ? `${user.fullName} (${user.amount})` : user.fullName;

	if (user.userId === currentUserId) {
		return <strong>{content}</strong>;
	}

	return <>{content}</>;
}
