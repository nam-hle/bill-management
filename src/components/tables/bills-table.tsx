"use client";

import _ from "lodash";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { TypographyH1 } from "@/components/typography";
import { DataTable } from "@/components/data-table/data-table";

import { API } from "@/api";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { formatTime, formatDistanceTime } from "@/utils";

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
		<div data-testid="table-container" className="flex w-full flex-col gap-4">
			<div data-testid="table-heading" className="flex w-full flex-row justify-between">
				<TypographyH1 data-testid="table-title">
					{title ?? "Bills"}
					{advanced && isSuccess ? ` (${data.fullSize})` : ""}
				</TypographyH1>
				{action}
			</div>
			{/*{advanced && (*/}
			{/*	<HStack width="100%" data-testid="table-filters">*/}
			{/*		<FilterButton {...createOwnerFilter("creator")}>As creator</FilterButton>*/}
			{/*		<FilterButton {...createOwnerFilter("creditor")}>As creditor</FilterButton>*/}
			{/*		<FilterButton {...createOwnerFilter("debtor")}>As debtor</FilterButton>*/}
			{/*		<FilterButton {...createTimeFilter("7d")}>Last 7 days</FilterButton>*/}
			{/*		<FilterButton {...createTimeFilter("30d")}>Last 30 days</FilterButton>*/}
			{/*		/!*<InputGroup w="200px" marginLeft="auto" startElement={<GoSearch />}>*!/*/}
			{/*		<Input*/}
			{/*			name="search-bar"*/}
			{/*			value={filters.q || ""}*/}
			{/*			className="w-50 ml-auto"*/}
			{/*			placeholder="Type to search.."*/}
			{/*			onChange={(e) => onFilterChange("q", e.target.value)}*/}
			{/*		/>*/}
			{/*		/!*</InputGroup>*!/*/}
			{/*	</HStack>*/}
			{/*)}*/}

			<DataTable
				data={data?.data ?? []}
				columns={[
					{
						key: "description",
						label: "Description",
						dataGetter: ({ row }) => row.description
					},
					{
						key: "createdAt",
						label: "Created",
						titleGetter: ({ row }) => formatTime(row.creator.timestamp),
						dataGetter: ({ row }) => formatDistanceTime(row.creator.timestamp)
					},
					{
						key: "creditor",
						label: "Creditor",
						dataGetter: ({ row }) => formatUserAmount(row.creditor, currentUserId)
					},
					{
						key: "debtors",
						label: "Debtors",
						dataGetter: ({ row }) => (
							<span className="truncate">
								{_.sortBy(row.debtors, [(debtor) => debtor.userId !== currentUserId, (billMember) => billMember.userId]).map(
									(billMember, billMemberIndex) => (
										<React.Fragment key={billMember.userId}>
											{formatUserAmount(billMember, currentUserId)}
											{billMemberIndex !== row.debtors.length - 1 ? ", " : ""}
										</React.Fragment>
									)
								)}
							</span>
						)
					}
				]}
			/>

			{/*{advanced && isSuccess && DEFAULT_PAGE_SIZE < data.fullSize && (*/}
			{/*	<HStack w="100%" justifyContent="flex-end">*/}
			{/*		<PaginationRoot*/}
			{/*			siblingCount={1}*/}
			{/*			page={filters.page}*/}
			{/*			count={data.fullSize}*/}
			{/*			pageSize={DEFAULT_PAGE_SIZE}*/}
			{/*			onPageChange={({ page }) => onFilterChange("page", page)}>*/}
			{/*			<PaginationPrevTrigger />*/}
			{/*			<PaginationItems />*/}
			{/*			<PaginationNextTrigger />*/}
			{/*		</PaginationRoot>*/}
			{/*	</HStack>*/}
			{/*)}*/}
		</div>
	);
};

function formatUserAmount(user: { userId: string; amount?: number; fullName: string | null }, currentUserId: string): React.ReactNode {
	const content = user.amount ? `${user.fullName} (${user.amount})` : user.fullName;

	if (user.userId === currentUserId) {
		return <strong>{content}</strong>;
	}

	return <>{content}</>;
}
