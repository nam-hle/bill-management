"use client";

import _ from "lodash";
import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Table, HStack, VStack, Heading } from "@chakra-ui/react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

import { type ClientBill } from "@/types";
import { LinkButton } from "@/components/ui/link-button";
import { FilterButton } from "@/components/app/filter-button";
import { LinkedTableRow } from "@/components/app/table-body-row";

namespace BillsTable {
	export interface Props {
		readonly bills: ClientBill[];
	}
}

const FILTER_KEYS = ["creditor", "creator", "debtor"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];
type Filters = Partial<Record<FilterKey, string>>;

function toFilters(searchParams: ReadonlyURLSearchParams) {
	const params: Filters = {};
	searchParams.forEach((value, key) => {
		if (FILTER_KEYS.includes(key as FilterKey)) {
			params[key as FilterKey] = value;
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
		(filterKey: FilterKey, filterValue: string | null) => {
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

	return (
		<VStack width="100%" gap="{spacing.4}">
			<HStack width="100%" justifyContent="space-between">
				<Heading>Bills</Heading>
				<LinkButton variant="solid" href="/bills/new">
					<IoIosAddCircle /> New
				</LinkButton>
			</HStack>
			<HStack width="100%">
				<FilterButton
					active={filters.creator === "me"}
					onClick={() => {
						onFilterChange("creator", filters.creator === undefined ? "me" : null);
					}}>
					Bills I Created
				</FilterButton>
				<FilterButton
					active={filters.creditor === "me"}
					onClick={() => {
						onFilterChange("creditor", filters.creditor === undefined ? "me" : null);
					}}>
					Bills Owed to Me
				</FilterButton>
				<FilterButton
					active={filters.debtor === "me"}
					onClick={() => {
						onFilterChange("debtor", filters.debtor === undefined ? "me" : null);
					}}>
					Bills I Owe
				</FilterButton>
			</HStack>
			<Table.Root size="md" interactive variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader>ID</Table.ColumnHeader>
						<Table.ColumnHeader>Description</Table.ColumnHeader>
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
							<Table.Cell>{item.creator.username}</Table.Cell>
							<Table.Cell>
								{item.bill_members
									.flatMap((billMember) => {
										if (billMember.role === "Creditor") {
											return `${billMember.user?.username} (${billMember.amount})`;
										}

										return [];
									})
									.join(", ")}
							</Table.Cell>
							<Table.Cell>
								{_.sortBy(item.bill_members, [(billMember) => billMember.user?.id])
									.flatMap((billMember) => {
										if (billMember.role === "Creditor") {
											return [];
										}

										return `${billMember.user?.username} (${billMember.amount})`;
									})
									.join(", ")}
							</Table.Cell>
						</LinkedTableRow>
					))}
				</Table.Body>
			</Table.Root>
		</VStack>
	);
};
