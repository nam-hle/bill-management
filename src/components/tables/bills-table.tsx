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

const TIME_FILTER_KEYS = ["since"] as const;
type TimeFilterKey = (typeof TIME_FILTER_KEYS)[number];

const OWNER_FILTER_KEYS = ["creditor", "creator", "debtor"] as const;
type OwnerFilterKey = (typeof OWNER_FILTER_KEYS)[number];
interface Filters extends Partial<Record<OwnerFilterKey, "me">> {
	since?: "7d" | "30d";
}

function toFilters(searchParams: ReadonlyURLSearchParams) {
	const params: Filters = {};
	searchParams.forEach((value, key) => {
		if (OWNER_FILTER_KEYS.includes(key as OwnerFilterKey) || TIME_FILTER_KEYS.includes(key as TimeFilterKey)) {
			// @ts-expect-error asd asd asd
			params[key as OwnerFilterKey] = value;
		}
	});

	return params;
}

function toPagination(searchParams: ReadonlyURLSearchParams) {
	const pageSize = searchParams.get("limit");
	const pageNumber = searchParams.get("page");

	return {
		pageSize: pageSize ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE,
		pageNumber: pageNumber ? parseInt(pageNumber, 10) : DEFAULT_PAGE_NUMBER
	};
}

function toTextSearch(searchParams: ReadonlyURLSearchParams) {
	return searchParams.get("search") ?? "";
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { title, action, advanced, currentUserId } = props;
	const searchParams = useSearchParams();
	const [textSearch, setTextSearch] = React.useState(() => toTextSearch(searchParams));

	const filters = toFilters(searchParams);
	const pagination = toPagination(searchParams);

	const router = useRouter();

	const onFilterChange = React.useCallback(
		(filterKey: OwnerFilterKey | TimeFilterKey, filterValue: string | null) => {
			const updatedFilters = { ...filters };

			if (filterValue !== null) {
				// @ts-expect-error asd asd asd sa
				updatedFilters[filterKey] = filterValue;
			} else {
				delete updatedFilters[filterKey];
			}

			router.push(`?${new URLSearchParams(updatedFilters).toString()}`);
		},
		[filters, router]
	);

	const onSearch = React.useCallback(() => {
		const updatedFilters: Filters & { search?: string } = { ...filters, search: textSearch };

		if (textSearch === "") {
			delete updatedFilters.search;
		}

		// @ts-expect-error asdasd asd asdas d
		router.push(`?${new URLSearchParams(updatedFilters).toString()}`);
	}, [filters, router, textSearch]);

	const onPageChange = React.useCallback(
		(params: { page: number }) => {
			const updatedFilters = { ...filters, page: String(params.page) };

			router.push(`?${new URLSearchParams(updatedFilters).toString()}`);
		},
		[filters, router]
	);

	const createOwnerFilter = React.useCallback(
		(filterKey: OwnerFilterKey) => {
			return {
				active: filters[filterKey] === "me",
				onClick: () => onFilterChange(filterKey, filters[filterKey] === undefined ? "me" : null)
			};
		},
		[filters, onFilterChange]
	);

	const createTimeFilter = React.useCallback(
		(filterKey: TimeFilterKey, duration: string) => {
			return {
				active: filters[filterKey] === duration,
				onClick: () => onFilterChange(filterKey, filters[filterKey] !== duration ? duration : null)
			};
		},
		[filters, onFilterChange]
	);

	const searchParams2 = useDebounce(
		{
			textSearch,
			since: filters.since,
			debtorId: filters.debtor,
			creatorId: filters.creator,
			page: pagination.pageNumber,
			creditorId: filters.creditor
		},
		500
	);
	const { data, isSuccess, isPending } = useQuery({
		queryKey: ["bills", searchParams2],
		queryFn: () => API.Bills.List.query(searchParams2)
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
					<FilterButton {...createTimeFilter("since", "7d")}>Last 7 days</FilterButton>
					<FilterButton {...createTimeFilter("since", "30d")}>Last 30 days</FilterButton>
					<InputGroup w="200px" marginLeft="auto" startElement={<GoSearch />}>
						<Input
							onBlur={onSearch}
							name="search-bar"
							value={textSearch}
							placeholder="Type to search.."
							onChange={(e) => setTextSearch(e.target.value)}
						/>
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
			{advanced && isSuccess && pagination.pageSize < data.fullSize && (
				<HStack w="100%" justifyContent="flex-end">
					<PaginationRoot
						siblingCount={1}
						count={data.fullSize}
						onPageChange={onPageChange}
						page={pagination.pageNumber}
						pageSize={pagination.pageSize}>
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
