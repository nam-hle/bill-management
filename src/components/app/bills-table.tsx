"use client";

import _ from "lodash";
import React from "react";
import { GoSearch } from "react-icons/go";
import { Table, Input, HStack, VStack, Heading } from "@chakra-ui/react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { type ClientBill } from "@/types";
import { InputGroup } from "@/components/ui/input-group";
import { formatTime, formatDistanceTime } from "@/utils";
import { PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { FilterButton } from "@/components/app/filter-button";
import { LinkedTableRow } from "@/components/app/table-body-row";
import { PaginationRoot, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from "@/components/ui/pagination";

namespace BillsTable {
	export interface Props {
		readonly title?: string;
		readonly fullSize: number;
		readonly bills: ClientBill[];
		readonly showFilters?: boolean;
		readonly currentUserId: string;
		readonly showFullSize?: boolean;
		readonly showSearchBar?: boolean;
		readonly showPagination?: boolean;
		readonly action?: React.ReactNode;
	}
}

const TIME_FILTER_KEYS = ["since"] as const;
type TimeFilterKey = (typeof TIME_FILTER_KEYS)[number];

const OWNER_FILTER_KEYS = ["creditor", "creator", "debtor"] as const;
type OwnerFilterKey = (typeof OWNER_FILTER_KEYS)[number];
type Filters = Partial<Record<OwnerFilterKey | TimeFilterKey, string>>;

function toFilters(searchParams: ReadonlyURLSearchParams) {
	const params: Filters = {};
	searchParams.forEach((value, key) => {
		if (OWNER_FILTER_KEYS.includes(key as OwnerFilterKey) || TIME_FILTER_KEYS.includes(key as TimeFilterKey)) {
			params[key as OwnerFilterKey] = value;
		}
	});

	return params;
}

function toPagination(searchParams: ReadonlyURLSearchParams) {
	const pageSize = searchParams.get("limit");
	const pageNumber = searchParams.get("page");

	return {
		pageSize: pageSize ? parseInt(pageSize, 10) : PAGE_SIZE,
		pageNumber: pageNumber ? parseInt(pageNumber, 10) : DEFAULT_PAGE_NUMBER
	};
}

function toTextSearch(searchParams: ReadonlyURLSearchParams) {
	return searchParams.get("search") ?? "";
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { bills, title, action, fullSize, showFilters, showFullSize, currentUserId, showSearchBar, showPagination } = props;
	const searchParams = useSearchParams();
	const [textSearch, setTextSearch] = React.useState(() => toTextSearch(searchParams));

	const filters = toFilters(searchParams);
	const pagination = toPagination(searchParams);

	const router = useRouter();

	const onFilterChange = React.useCallback(
		(filterKey: OwnerFilterKey | TimeFilterKey, filterValue: string | null) => {
			const updatedFilters = { ...filters };

			if (filterValue !== null) {
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

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">
					{title ?? "Bills"}
					{showFullSize ? ` (${fullSize})` : ""}
				</Heading>
				{action}
			</HStack>
			<HStack width="100%">
				{showFilters && (
					<>
						<FilterButton {...createOwnerFilter("creator")}>My Created Bills</FilterButton>
						<FilterButton {...createOwnerFilter("creditor")}>My Credits</FilterButton>
						<FilterButton {...createOwnerFilter("debtor")}>My Debts</FilterButton>
						<FilterButton {...createTimeFilter("since", "7d")}>Last 7 days</FilterButton>
						<FilterButton {...createTimeFilter("since", "30d")}>Last 30 days</FilterButton>
					</>
				)}
				{showSearchBar && (
					<InputGroup w="200px" marginLeft="auto" startElement={<GoSearch />}>
						<Input onBlur={onSearch} value={textSearch} placeholder="Type to search.." onChange={(e) => setTextSearch(e.target.value)} />
					</InputGroup>
				)}
			</HStack>

			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Created</Table.ColumnHeader>
						<Table.ColumnHeader>Creator</Table.ColumnHeader>
						<Table.ColumnHeader title="The one who made the payment for the bill">Creditor</Table.ColumnHeader>
						<Table.ColumnHeader title="The ones who need to pay back the creditor">Debtors</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{bills?.map((item) => (
						<LinkedTableRow key={item.id} href={`/bills/${item.id}`}>
							<Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
							<Table.Cell title={formatTime(item.creator.timestamp)}>{formatDistanceTime(item.creator.timestamp)}</Table.Cell>
							<Table.Cell>{formatUserAmount(item.creator, currentUserId)}</Table.Cell>
							<Table.Cell>{formatUserAmount(item.creditor, currentUserId)}</Table.Cell>
							<Table.Cell>
								{_.sortBy(item.debtors, [(debtor) => debtor.userId !== currentUserId, (billMember) => billMember.userId]).map(
									(billMember, billMemberIndex) => (
										<React.Fragment key={billMember.userId}>
											{formatUserAmount(billMember, currentUserId)}
											{billMemberIndex !== item.debtors.length - 1 ? ", " : ""}
										</React.Fragment>
									)
								)}
							</Table.Cell>
						</LinkedTableRow>
					))}
				</Table.Body>
			</Table.Root>
			{showPagination && pagination.pageSize < fullSize && (
				<HStack w="100%" justifyContent="flex-end">
					<PaginationRoot siblingCount={1} count={fullSize} onPageChange={onPageChange} page={pagination.pageNumber} pageSize={pagination.pageSize}>
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
