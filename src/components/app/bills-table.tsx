"use client";

import _ from "lodash";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { type ClientBill } from "@/types";
import { FilterButton } from "@/components/app/filter-button";
import { LinkedTableRow } from "@/components/app/table-body-row";

namespace BillsTable {
	export interface Props {
		readonly title?: string;
		readonly bills: ClientBill[];
		readonly showFilters?: boolean;
		readonly currentUserId: string;
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

export const BillsTable: React.FC<BillsTable.Props> = (props) => {
	const { bills } = props;
	const searchParams = useSearchParams();

	const filters = toFilters(searchParams);

	const router = useRouter();

	const onFilterChange = React.useCallback(
		(filterKey: OwnerFilterKey | TimeFilterKey, filterValue: string | null) => {
			const updatedFilters = { ...filters };

			if (filterValue !== null) {
				updatedFilters[filterKey] = filterValue;
			} else {
				delete updatedFilters[filterKey];
			}

			const params = new URLSearchParams(updatedFilters);

			router.push(`?${params.toString()}`);
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
				<Heading>{props.title ?? "Bills"}</Heading>
				{props.action}
			</HStack>
			{props.showFilters && (
				<HStack width="100%">
					<FilterButton {...createOwnerFilter("creator")}>My Created Bills</FilterButton>
					<FilterButton {...createOwnerFilter("creditor")}>My Credits</FilterButton>
					<FilterButton {...createOwnerFilter("debtor")}>My Debts</FilterButton>
					<FilterButton {...createTimeFilter("since", "7d")}>Last 7 days</FilterButton>
					<FilterButton {...createTimeFilter("since", "30d")}>Last 30 days</FilterButton>
				</HStack>
			)}
			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
						<Table.ColumnHeader>Created</Table.ColumnHeader>
						<Table.ColumnHeader>Creator</Table.ColumnHeader>
						<Table.ColumnHeader>Creditor</Table.ColumnHeader>
						<Table.ColumnHeader>Debtors</Table.ColumnHeader>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{bills?.map((item) => (
						<LinkedTableRow key={item.id} href={`/bills/${item.id}`}>
							<Table.Cell>{item.id.slice(0, 6)}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
							<Table.Cell title={item.createdAt ? format(new Date(item.createdAt), "PPpp") : undefined}>
								{item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : undefined}
							</Table.Cell>
							<Table.Cell>{item.creator.fullName}</Table.Cell>
							<Table.Cell>{`${item.creditor.fullName} (${item.creditor.amount})`}</Table.Cell>
							<Table.Cell>
								{_.sortBy(item.debtors, [(debtor) => debtor.userId !== props.currentUserId, (billMember) => billMember.userId])
									.map((billMember) => `${billMember.fullName} (${billMember.amount})`)
									.join(", ")}
							</Table.Cell>
						</LinkedTableRow>
					))}
				</Table.Body>
			</Table.Root>
		</VStack>
	);
};
