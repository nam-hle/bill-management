"use client";

import _ from "lodash";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { FilterButton } from "@/components/filter-button";
import { DataTable } from "@/components/data-table/data-table";
import { FallbackAvatar } from "@/components/fallbackable-avatar";

import { API } from "@/api";
import { formatCurrency } from "@/utils/format";
import { type ClientBillMember } from "@/schemas";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { formatTime, formatDistanceTime } from "@/utils";

import { Input } from "../shadcn/input";

namespace BillsTable {
	export interface Props {
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

function UserAvatarAmount(props: { row: ClientBillMember }) {
	return (
		<div data-testid="avatar-amount" className="flex flex-row items-center space-x-2">
			<FallbackAvatar {...props.row} />
			<span data-testid="amount">{formatCurrency(props.row.amount)}</span>
		</div>
	);
}

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { action, currentUserId } = props;
	const searchParams = useSearchParams();
	const [filters, setFilters] = React.useState(() => toFilters(searchParams));

	const onFilterChange = React.useCallback(<T extends keyof Filters>(filterKey: T, filterValue: Filters[T]) => {
		setFilters((prevFilters) => {
			const nextFilters: Filters = {
				...prevFilters,
				[filterKey]: filterValue,
				page: filterKey === "page" ? (filterValue as number) : DEFAULT_PAGE_NUMBER
			};

			return nextFilters;
		});
	}, []);

	const router = useRouter();
	React.useEffect(() => {
		router.push(toSearchParams(filters));
	}, [filters, router]);

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
	const { data, isPending } = useQuery({
		queryKey: ["bills", query],
		queryFn: () => API.Bills.List.query(query)
	});

	return (
		<DataTable
			title="Bills"
			action={action}
			loading={isPending}
			data={data?.data?.map((row) => ({ ...row, href: `/bills/${row.id}` }))}
			pagination={{
				pageNumber: query.page,
				fullSize: data?.fullSize,
				onPageChange: (page) => onFilterChange("page", page)
			}}
			toolbar={
				<>
					<Input
						className="w-50"
						name="search-bar"
						value={filters.q || ""}
						placeholder="Filter bills..."
						onChange={(e) => onFilterChange("q", e.target.value)}
					/>
					<FilterButton {...createOwnerFilter("creator")}>As creator</FilterButton>
					<FilterButton {...createOwnerFilter("creditor")}>As creditor</FilterButton>
					<FilterButton {...createOwnerFilter("debtor")}>As debtor</FilterButton>
					<FilterButton {...createTimeFilter("7d")}>Last 7 days</FilterButton>
					<FilterButton {...createTimeFilter("30d")}>Last 30 days</FilterButton>
				</>
			}
			columns={[
				{ key: "description", label: "Description", dataGetter: ({ row }) => row.description },
				{
					key: "createdAt",
					label: "Created",
					titleGetter: ({ row }) => formatTime(row.creator.timestamp),
					dataGetter: ({ row }) => formatDistanceTime(row.creator.timestamp)
				},
				{
					key: "creditor",
					label: "Creditor",
					dataGetter: ({ row }) => <UserAvatarAmount row={row.creditor} />
				},
				{
					key: "debtors",
					label: "Debtors",
					dataGetter: ({ row }) => (
						<div className="flex flex-row space-x-2">
							{_.sortBy(row.debtors, [(debtor) => debtor.userId !== currentUserId, (billMember) => billMember.fullName]).map((billMember) => (
								<UserAvatarAmount row={billMember} key={billMember.userId} />
							))}
						</div>
					)
				}
			]}
		/>
	);
};
